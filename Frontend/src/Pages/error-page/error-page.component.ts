import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-error-page',
  standalone: false,
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
  firstDigit = '4';
  secondDigit = '0';
  thirdDigit = '4';

  constructor(
    private location: Location,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }
}