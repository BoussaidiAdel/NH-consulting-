import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SlideContainerComponent } from '../../components/slide-container/slide-container.component';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  standalone: false,
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {

  @Input() slides: any[] = [
    {
      title: 'Malacca',
      image: 'https://farm9.staticflickr.com/8059/28286750501_dcc27b1332_h_d.jpg',
      position: 'top-left'
    },
    {
      title: 'Cameron Highland',
      image: 'https://farm6.staticflickr.com/5812/23394215774_b76cd33a87_h_d.jpg',
      position: 'bottom-right'
    },
    {
      title: 'New Delhi',
      image: 'https://farm8.staticflickr.com/7455/27879053992_ef3f41c4a0_h_d.jpg',
      position: 'bottom-left'
    },
    {
      title: 'Ladakh',
      image: 'https://farm8.staticflickr.com/7367/27980898905_72d106e501_h_d.jpg',
      position: 'top-right'
    },
    {
      title: 'Nubra Valley',
      image: 'https://farm8.staticflickr.com/7356/27980899895_9b6c394fec_h_d.jpg',
      position: 'bottom-left'
    }
  ];

  currentSlide = 0;
  autoSlideInterval: any;
  touchStartX = 0;
  touchEndX = 0;

  ngOnInit() {
    this.startAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  resetAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  selectSlide(index: number) {
    this.currentSlide = index;
    this.resetAutoSlide();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide === 0) ? this.slides.length - 1 : this.currentSlide - 1;
    this.resetAutoSlide();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide === this.slides.length - 1) ? 0 : this.currentSlide + 1;
    this.resetAutoSlide();
  }

  handleTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  handleTouchMove(event: TouchEvent) {
    this.touchEndX = event.touches[0].clientX;
  }

  handleTouchEnd() {
    if (this.touchStartX - this.touchEndX > 50) {
      // Swipe left, go to next slide
      this.nextSlide();
    }

    if (this.touchEndX - this.touchStartX > 50) {
      // Swipe right, go to previous slide
      this.prevSlide();
    }
  }

}
