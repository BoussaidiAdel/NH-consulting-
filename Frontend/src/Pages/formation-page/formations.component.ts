  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
  import { Formation } from '../../Models/Formation';
  import { FormationService } from '../../Services/formation.service';
  import { AuthService } from '../../Services/auth.service';
  import { Store } from '@ngrx/store';
  import { AppState } from '../../Utils/app.state';

  @Component({
    selector: 'app-formations',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './formations.component.html',
    styleUrls: ['./formations.component.scss']
  })
  export class FormationsComponent implements OnInit {
    formations: Formation[] = [];
    selectedFormation: Formation | null = null;
    errorMessage: string = '';

    // Admin functionality properties
    isLoggedIn: boolean = false;
    userRole: string | null = null;

    // Form management
    formationForm!: FormGroup;
    showFormationForm: boolean = false;
    editMode: boolean = false;

    // Delete confirmation
    showDeleteConfirmation: boolean = false;
    formationToDelete: Formation | null = null;

    constructor(
      private formationService: FormationService,
      private authService: AuthService,
      private store: Store<AppState>,
      private fb: FormBuilder
    ) {}

    ngOnInit(): void {
      // Load formations
      this.loadFormations();

      // Subscribe to auth state
      this.store.select(state => state.auth).subscribe(authState => {
        this.isLoggedIn = authState.isLoggedIn;
        this.userRole = authState.role;
      });

      // Initialize form
      this.initFormationForm();
    }

    // Initialize the form
    initFormationForm(): void {
      this.formationForm = this.fb.group({
        id: [null],
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        prix: [0, [Validators.required, Validators.min(0)]],
        imageUrl: ['', [Validators.required]],
        duree: [0, [Validators.required, Validators.min(1)]],
        nomFormateur: ['', [Validators.required]],
        etat: ['En ligne', [Validators.required]],
        niveau: ['Débutant', [Validators.required]],
        active: [true]
      });
    }

    // Load formations from service
    loadFormations(): void {
      this.formationService.getAllFormations().subscribe({
        next: (data) => {
          this.formations = data;
        },
        error: (error) => {
          this.errorMessage = error.message;
          console.error('Error fetching formations:', error);
        }
      });
    }

    // Open formation details modal
    openDetails(formation: Formation): void {
      this.selectedFormation = formation;
    }

    // Close formation details modal
    closeDetails(): void {
      this.selectedFormation = null;
    }

    // Register for a formation
    register(formation: Formation): void {
      // Implement registration logic
      console.log('Registering for formation:', formation);

      // If user is not logged in, redirect to login
      if (!this.isLoggedIn) {
        // Navigate to login page or open login modal
        console.log('User needs to login first');
        // this.router.navigate(['/login']);
      } else {
        // Process registration
        console.log('Processing registration for logged in user');
      }
    }

    // ADMIN FUNCTIONALITY

    // Open the formation form (add or edit)
    openFormationForm(formation?: Formation): void {
      if (formation) {
        // Edit existing formation
        this.editMode = true;
        this.formationForm.patchValue(formation);
      } else {
        // Add new formation
        this.editMode = false;
        this.formationForm.reset({
          etat: 'En ligne',
          niveau: 'Débutant',
          active: true,
          prix: 0,
          duree: 0
        });
      }

      this.showFormationForm = true;
    }

    // Close the formation form
    closeFormationForm(): void {
      this.showFormationForm = false;
      this.formationForm.reset();
    }

    // Save formation (add or update)
    saveFormation(): void {
      if (this.formationForm.invalid) return;

      const formData = this.formationForm.value;

      if (this.editMode) {
        // Update existing formation
        this.formationService.updateFormation(formData).subscribe({
          next: (updatedFormation) => {
            // Update the formation in the local array
            const index = this.formations.findIndex(f => f.id === updatedFormation.id);
            if (index !== -1) {
              this.formations[index] = updatedFormation;
            }

            // Close form and show notification
            this.closeFormationForm();
            this.closeDetails(); // Close details if open
            console.log('Formation updated successfully');
          },
          error: (error) => {
            console.error('Error updating formation:', error);
            this.errorMessage = 'Failed to update formation';
          }
        });
      } else {
        // Add new formation
        this.formationService.addFormation(formData).subscribe({
          next: (newFormation) => {
            // Add to the local array
            this.formations.push(newFormation);

            // Close form and show notification
            this.closeFormationForm();
            console.log('Formation added successfully');
          },
          error: (error) => {
            console.error('Error adding formation:', error);
            this.errorMessage = 'Failed to add formation';
          }
        });
      }
    }

    // Edit formation
    editFormation(formation: Formation, event?: Event): void {
      if (event) {
        event.stopPropagation(); // Prevent opening details modal
      }

      this.openFormationForm(formation);
    }

    // Initiate delete formation process
    deleteFormation(formation: Formation, event?: Event): void {
      if (event) {
        event.stopPropagation(); // Prevent opening details modal
      }

      this.formationToDelete = formation;
      this.showDeleteConfirmation = true;
    }

    // Cancel delete operation
    cancelDelete(): void {
      this.formationToDelete = null;
      this.showDeleteConfirmation = false;
    }

    // Confirm and perform delete
    confirmDelete(): void {
      if (!this.formationToDelete) return;

      this.formationService.deleteFormation(this.formationToDelete.id.toString()).subscribe({
        next: () => {
          // Remove from local array
          this.formations = this.formations.filter(f => f.id !== this.formationToDelete?.id);

          // Close confirmation and details if open
          this.cancelDelete();
          if (this.selectedFormation?.id === this.formationToDelete?.id) {
            this.closeDetails();
          }

          console.log('Formation deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting formation:', error);
          this.errorMessage = 'Failed to delete formation';
        }
      });
    }
  }
