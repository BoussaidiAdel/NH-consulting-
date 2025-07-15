import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Formation } from '../../Models/Formation';
import { FormationService } from '../../Services/formation.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-slide-container',
  standalone: false,
  templateUrl: './slide-container.component.html',
  styleUrls: ['./slide-container.component.css']
})
export class SlideContainerComponent implements AfterViewInit {
  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('carouselWrapper') carouselWrapper!: ElementRef<HTMLDivElement>;

  formations: Formation[] = [];
  errorMessage: string = '';
  loading: boolean = true;

  constructor(
    private formationService: FormationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngAfterViewInit(): void {
    this.loadFormations();
    // Wait for the view to be fully initialized
    setTimeout(() => {
      this.setupWheelScrolling();
    }, 0);
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
      if (!this.carouselContainer?.nativeElement || !this.carouselWrapper?.nativeElement) {
        return;
      }

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
    if (!this.carouselContainer?.nativeElement) {
      console.warn('Carousel container not found');
      return;
    }

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
    if (!this.carouselContainer?.nativeElement || !this.carouselWrapper?.nativeElement) {
      return;
    }

    const container = this.carouselContainer.nativeElement;
    const wrapper = this.carouselWrapper.nativeElement;

    const containerCenter = container.scrollLeft + (container.clientWidth / 2);
    const items = Array.from(wrapper.querySelectorAll('.item')) as HTMLElement[];

    let closestItem: HTMLElement | null = null;
    let smallestDistance = Infinity;

    for (const item of items) {
      const itemLeft = item.offsetLeft;
      const itemWidth = item.offsetWidth;
      const itemCenter = itemLeft + (itemWidth / 2);
      const distance = Math.abs(containerCenter - itemCenter);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestItem = item;
      }
    }

    if (closestItem !== null) {
      const id = closestItem.getAttribute('data-id');
      if (id) {
        const shouldUpdate = !this.formations.find(f => f.id === id)?.active;
        if (shouldUpdate) {
          this.formations.forEach(formation => {
            formation.active = formation.id === id;
          });
        }
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

  // Helper methods for getting localized values
  getTitleValue(title: { fr: string; en: string }): string {
    const lang = this.translate.currentLang === 'en' ? 'en' : 'fr';
    return title[lang] || title.fr;
  }

  getDescriptionValue(description: { fr: string; en: string }): string {
    const lang = this.translate.currentLang === 'en' ? 'en' : 'fr';
    return description[lang] || description.fr;
  }

  getNiveauValue(niveau: { fr: string; en: string }): string {
    const lang = this.translate.currentLang === 'en' ? 'en' : 'fr';
    return niveau[lang] || niveau.fr;
  }

  register(formation: Formation): void {
    // Navigate to signin page with formation id
    this.router.navigate(['/signin', formation.id]);
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
