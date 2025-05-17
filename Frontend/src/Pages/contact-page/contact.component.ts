import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactService } from '../../Services/contact.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ContactFormData } from '../../Models/Contact';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: false
})
export class ContactComponent implements OnInit, OnDestroy {
  contactForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';
  
  // For clean subscription management
  private destroy$ = new Subject<void>();
  
  constructor(
    private contactService: ContactService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService
  ) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions when component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  initForm(): void {
    this.contactForm = this.formBuilder.group({
      fullname: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.maxLength(254) // RFC 5321 email length limit
      ]],
      phone: ['', [
        Validators.pattern(/^[0-9\+\-\s\(\)]{0,20}$/)
      ]],
      subject: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(150)
      ]],
      message: ['', [
        Validators.required, 
        Validators.minLength(10),
        Validators.maxLength(2000)
      ]]
    });
  }
  
  get f() {
    return this.contactForm.controls;
  }
  
  // Display validation error messages
  getErrorMessage(controlName: string): string {
    const control = this.contactForm.get(controlName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }
    
    if (control.hasError('required')) {
      return this.translateService.instant('CONTACT.ERRORS.REQUIRED');
    }
    
    if (control.hasError('email')) {
      return this.translateService.instant('CONTACT.ERRORS.EMAIL');
    }
    
    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return this.translateService.instant('CONTACT.ERRORS.MIN_LENGTH', { minLength });
    }
    
    if (control.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength']?.requiredLength;
      return this.translateService.instant('CONTACT.ERRORS.MAX_LENGTH', { maxLength });
    }
    
    if (control.hasError('pattern')) {
      return this.translateService.instant('CONTACT.ERRORS.PATTERN');
    }
    
    return '';
  }
  
  onSubmit(): void {
    // Mark all fields as touched to trigger validation display
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });
    
    if (this.contactForm.valid) {
      // Reset previous submission states
      this.isSubmitting = true;
      this.submitSuccess = false;
      this.submitError = '';
      
      const formData: ContactFormData = this.contactForm.value;
      
      this.contactService.sendEmail(formData)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.isSubmitting = false; // Always execute regardless of success/failure
          })
        )
        .subscribe({
          next: (response) => {
            this.submitSuccess = true;
            this.contactForm.reset();
            
            // Reset touched states
            Object.keys(this.contactForm.controls).forEach(key => {
              this.contactForm.get(key)?.markAsUntouched();
            });
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
              if (this.submitSuccess) { // Check if component is still alive
                this.submitSuccess = false;
              }
            }, 5000);
          },
          error: (err) => {
            console.error('Form submission error:', err);
            this.submitError = err.message || 
              this.translateService.instant('CONTACT.ERRORS.GENERIC');
          }
        });
    }
  }
  
  // Helper method to check if a field is invalid and touched (for template use)
  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }
}