import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Formation } from '../../Models/Formation';
import { FormationService } from '../../Services/formation.service';
import { AuthService } from '../../Services/auth.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../Utils/app.state';
import { MatSnackBar} from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { selectUserRole } from '../../Utils/Selectors/auth.selectors';


@Component({
  selector: 'app-formations',
  standalone: false,
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.css']
})
export class FormationsComponent implements OnInit {
  formations: Formation[] = [];
  selectedFormation: Formation | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  userRole$: Observable<string | null>;

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

  // Search and filter
  searchTerm: string = '';
  selectedNiveau: string = '';
  selectedEtat: string = '';
  sortBy: string = '';

  constructor(
    private store: Store<AppState>,
    private formationService: FormationService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
      this.userRole$ = this.store.pipe(select(selectUserRole));
  }

  ngOnInit(): void {
  
    this.loadFormations();
    this.initFormationForm();
  }


    isLoggedInAndAdmin(role: string | null): boolean {
    return role === 'ADMIN';
  }

  initFormationForm(): void {
    this.formationForm = this.fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      prix: [0, [Validators.required, Validators.min(0)]],
      image: ['', [Validators.required]],
      duree: [0, [Validators.required, Validators.min(1)]],
      nomFormateur: ['', [Validators.required]],
      etat: ['En ligne', [Validators.required]],
      niveau: ['Débutant', [Validators.required]],
      active: [true],
      dateDebut: ['', [Validators.required]],
      dateFin: ['', [Validators.required]],
      placesDisponibles: [0, [Validators.required, Validators.min(0)]],
      prerequis: ['', [Validators.required]],
      programme: ['', [Validators.required]]
    });
  }

  loadFormations(): void {
    this.isLoading = true;
    this.formationService.getAllFormations(this.sortBy).subscribe({
      next: (data) => {
        this.formations = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Error fetching formations: ${error.message || 'Unknown error'}`;
        this.showError(this.errorMessage);
        this.isLoading = false;
      }
    });
  }

  searchFormations(): void {
    if (this.searchTerm.trim()) {
      this.formationService.searchFormations(this.searchTerm).subscribe({
        next: (data) => {
          this.formations = data;
        },
        error: (error) => {
          this.showError('Error searching formations');
        }
      });
    } else {
      this.loadFormations();
    }
  }

  filterByNiveau(): void {
    if (this.selectedNiveau) {
      this.formationService.getFormationsByNiveau(this.selectedNiveau).subscribe({
        next: (data) => {
          this.formations = data;
        },
        error: (error) => {
          this.showError('Error filtering formations by level');
        }
      });
    } else {
      this.loadFormations();
    }
  }

  filterByEtat(): void {
    if (this.selectedEtat) {
      this.formationService.getFormationsByEtat(this.selectedEtat).subscribe({
        next: (data) => {
          this.formations = data;
        },
        error: (error) => {
          this.showError('Error filtering formations by mode');
        }
      });
    } else {
      this.loadFormations();
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
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
    this.editMode = !!formation;
    this.showFormationForm = true;
    
    if (formation) {
      // Convert dates to YYYY-MM-DD format for the form
      const formationToEdit = {
        ...formation,
        dateDebut: formation.dateDebut ? new Date(formation.dateDebut).toISOString().split('T')[0] : '',
        dateFin: formation.dateFin ? new Date(formation.dateFin).toISOString().split('T')[0] : ''
      };
      this.formationForm.patchValue(formationToEdit);
    } else {
      this.formationForm.reset({
        etat: 'En ligne',
        niveau: 'Débutant',
        active: true,
        placesDisponibles: 0,
        prix: 0,
        duree: 1
      });
    }
  }

  // Close the formation form
  closeFormationForm(): void {
    this.showFormationForm = false;
    this.editMode = false;
    this.formationForm.reset();
  }

  // Save formation (add or update)
  saveFormation(): void {
    if (this.formationForm.valid) {
      const formationData = this.formationForm.value;
      
      if (this.editMode) {
        this.formationService.updateFormation(formationData).subscribe({
          next: () => {
            this.showSuccess('Formation mise à jour avec succès');
            this.closeFormationForm();
            this.loadFormations();
          },
          error: (error) => {
            this.showError(`Erreur lors de la mise à jour: ${error.message}`);
          }
        });
      } else {
        this.formationService.addFormation(formationData).subscribe({
          next: () => {
            this.showSuccess('Formation ajoutée avec succès');
            this.closeFormationForm();
            this.loadFormations();
          },
          error: (error) => {
            this.showError(`Erreur lors de l'ajout: ${error.message}`);
          }
        });
      }
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

        this.showSuccess('Formation deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting formation:', error);
        this.errorMessage = `Failed to delete formation: ${error.message || 'Unknown error'}`;
        this.showError(this.errorMessage);
      }
    });
  }
}
