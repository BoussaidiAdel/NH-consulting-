import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Formation } from '../../Models/Formation';
import { FormationService } from '../../Services/formation.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-slide-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-container.component.html',
  styleUrls: ['./slide-container.component.css']
})
export class SlideContainerComponent implements AfterViewInit {
  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('carouselWrapper') carouselWrapper!: ElementRef<HTMLDivElement>;

  formations: Formation[] = [];
  errorMessage: string = '';
  loading: boolean = true;

  constructor(private formationService: FormationService) {}

  ngAfterViewInit(): void {
    this.loadFormations();
    this.setupWheelScrolling();
  }

  loadFormations() {
    this.loading = true;
    this.formationService.getAllFormations()
      .subscribe({
        next: (data) => {
          this.formations = data;
          this.loading = false;

          // Ensure at least one formation is active
          if (!this.formations.some(f => f.active) && this.formations.length > 0) {
            this.formations[0].active = true;
          }

          // Allow time for DOM to update before scrolling
          setTimeout(() => {
            this.scrollToActiveItem();
          }, 300);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = `Une erreur s'est produite: ${error.message}`;
          console.error('Error fetching formations:', error);
        }
      });
  }

  toggleActive(item: Formation): void {
    this.formations.forEach(formation => {
      formation.active = formation.id === item.id;
    });
    this.scrollToItem(item);
  }

  scrollToActiveItem(): void {
    const activeFormation = this.formations.find(f => f.active);
    if (activeFormation) {
      this.scrollToItem(activeFormation);
    }
  }

  private scrollToItem(item: Formation): void {
    setTimeout(() => {
      const container = this.carouselContainer.nativeElement;
      const wrapper = this.carouselWrapper.nativeElement;

      const itemElements = wrapper.querySelectorAll('.item');
      const index = this.formations.findIndex(f => f.id === item.id);

      if (index === -1 || !itemElements[index]) return;

      const itemElement = itemElements[index] as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const itemRect = itemElement.getBoundingClientRect();

      const scrollLeft = container.scrollLeft + (itemRect.left - containerRect.left) - (containerRect.width / 2) + (itemRect.width / 2);

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }, 50);
  }

  private setupWheelScrolling(): void {
    const container = this.carouselContainer.nativeElement;

    container.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      container.scrollBy({
        left: e.deltaY * 0.7,
        behavior: 'smooth'
      });
      this.updateActiveOnScroll();
    });

    container.addEventListener('scroll', () => {
      this.updateActiveOnScroll();
    });
  }


  private updateActiveOnScroll(): void {
    const container = this.carouselContainer.nativeElement;
    const wrapper = this.carouselWrapper.nativeElement;

    if (!wrapper) return;

    const containerCenter = container.scrollLeft + (container.clientWidth / 2);
    const items = Array.from(wrapper.querySelectorAll('.item'));

    let closestItem: Element | null = null;
    let smallestDistance = Infinity;

    items.forEach((item) => {
      const element = item as HTMLElement;
      const itemLeft = element.offsetLeft;
      const itemWidth = element.offsetWidth;
      const itemCenter = itemLeft + (itemWidth / 2);
      const distance = Math.abs(containerCenter - itemCenter);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestItem = element;
      }
    });

    if (closestItem) {
      // @ts-ignore
      const id = closestItem.getAttribute('data-id');
      const shouldUpdate = !this.formations.find(f => f.id === id)?.active;

      if (shouldUpdate) {
        this.formations.forEach(formation => {
          formation.active = formation.id === id;
        });
      }
    }
  }

  nextFormation(): void {
    const activeIndex = this.formations.findIndex(f => f.active);
    if (activeIndex === -1) return;

    const nextIndex = (activeIndex + 1) % this.formations.length;
    this.toggleActive(this.formations[nextIndex]);
  }

  prevFormation(): void {
    const activeIndex = this.formations.findIndex(f => f.active);
    if (activeIndex === -1) return;

    const prevIndex = (activeIndex - 1 + this.formations.length) % this.formations.length;
    this.toggleActive(this.formations[prevIndex]);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      this.nextFormation();
    } else if (event.key === 'ArrowLeft') {
      this.prevFormation();
    }
  }
}
