import { Component } from '@angular/core';

@Component({
  selector: 'app-error-page',
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css'
})
export class ErrorPageComponent {
  firstDigit: number = 0;
  secondDigit: number = 0;
  thirdDigit: number = 0;

  private loop1: any;
  private loop2: any;
  private loop3: any;
  private time: number = 50;
  private i: number = 0;

  ngOnInit() {
    this.startDigitAnimation();
  }

  ngOnDestroy() {
    this.clearIntervals();
  }

  private randomNum(): number {
    return Math.floor(Math.random() * 9) + 1;
  }

  private startDigitAnimation() {
    this.clearIntervals();

    this.loop3 = setInterval(() => {
      if (this.i > 40) {
        clearInterval(this.loop3);
        this.thirdDigit = 4;
      } else {
        this.thirdDigit = this.randomNum();
        this.i++;
      }
    }, this.time);

    this.loop2 = setInterval(() => {
      if (this.i > 80) {
        clearInterval(this.loop2);
        this.secondDigit = 0;
      } else {
        this.secondDigit = this.randomNum();
        this.i++;
      }
    }, this.time);

    this.loop1 = setInterval(() => {
      if (this.i > 100) {
        clearInterval(this.loop1);
        this.firstDigit = 4;
      } else {
        this.firstDigit = this.randomNum();
        this.i++;
      }
    }, this.time);
  }

  private clearIntervals() {
    if (this.loop1) clearInterval(this.loop1);
    if (this.loop2) clearInterval(this.loop2);
    if (this.loop3) clearInterval(this.loop3);
    this.i = 0;
  }
}