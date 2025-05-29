import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from '../../Services/formation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private formationService: FormationService,
    private snackBar: MatSnackBar
  ) {
    this.signinForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]]
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
      
      const subscriptionData = {
        ...this.signinForm.value,
        formationId: this.formationId
      };

      this.formationService.subscribeToFormation(subscriptionData).subscribe({
        next: (response) => {
          this.snackBar.open('Inscription réussie ! Vous recevrez un email de confirmation.', 'Fermer', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.router.navigate(['/formations']);
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de l\'inscription. Veuillez réessayer.', 'Fermer', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.isLoading = false;
        }
      });
    }
  }
}
