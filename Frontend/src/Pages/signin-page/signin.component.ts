import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from '../../Services/formation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { FormationSubscriptionRequest } from '../../Models/Formation';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  standalone: false,
  styleUrl: 'signin.component.css'
})
export class SignInComponent implements OnInit {
  signinForm: FormGroup;
  formationId: string | null = null;
  formationTitle: string | null = null;
  formationPrice: number | null = null;
  isLoading: boolean = false;

  educationLevels = [
    { value: 'primary', key: 'SIGNIN.EDUCATION_LEVELS.PRIMARY' },
    { value: 'secondary', key: 'SIGNIN.EDUCATION_LEVELS.SECONDARY' },
    { value: 'high_school', key: 'SIGNIN.EDUCATION_LEVELS.HIGH_SCHOOL' },
    { value: 'bachelor', key: 'SIGNIN.EDUCATION_LEVELS.BACHELOR' },
    { value: 'master', key: 'SIGNIN.EDUCATION_LEVELS.MASTER' },
    { value: 'doctorate', key: 'SIGNIN.EDUCATION_LEVELS.DOCTORATE' },
    { value: 'other', key: 'SIGNIN.EDUCATION_LEVELS.OTHER' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private formationService: FormationService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.signinForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
      address: ['', [Validators.required]],
      educationLevel: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(16), Validators.max(100)]],
      studentClass: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit() {
    // Get formation data from query params
    this.route.queryParams.subscribe(params => {
      this.formationId = params['formationId'];
      this.formationTitle = params['formationTitle'];
      this.formationPrice = params['formationPrice'];
    });
  }

  onSubmit() {
    if (this.signinForm.valid && this.formationId) {
      this.isLoading = true;
      
      const subscriptionData: FormationSubscriptionRequest = {
        ...this.signinForm.value,
        formationId: this.formationId,
        age: parseInt(this.signinForm.value.age, 10)
      };

      this.formationService.subscribeToFormation(subscriptionData).subscribe({
        next: (response) => {
          this.translate.get('SIGNIN.MESSAGES.SUBSCRIPTION_SUCCESS').subscribe((message: string) => {
            this.snackBar.open(message, this.translate.instant('SIGNIN.COMMON.CLOSE'), {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          });
          this.router.navigate(['/formations']);
        },
        error: (error) => {
          this.translate.get('SIGNIN.MESSAGES.SUBSCRIPTION_ERROR').subscribe((message: string) => {
            this.snackBar.open(message, this.translate.instant('SIGNIN.COMMON.CLOSE'), {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          });
          this.isLoading = false;
        }
      });
    }
  }
}