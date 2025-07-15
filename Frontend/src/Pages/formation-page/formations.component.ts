import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Formation } from '../../Models/Formation';
import { FormationService } from '../../Services/formation.service';
import { AuthService } from '../../Services/auth.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../Utils/app.state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { selectUserRole } from '../../Utils/Selectors/auth.selectors';
import { selectSelectedLanguage } from '../../Utils/Selectors/language.selectors';
import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-formations',
  standalone: false,
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.css']
})
export class FormationsComponent implements OnInit, OnDestroy {
  formations: Formation[] = [];
  filteredFormations: Formation[] = [];
  selectedFormation: Formation | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  userRole$: Observable<string | null>;
  currentLanguage: string = 'fr';
  private subscriptions: Subscription[] = [];

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
  selectedNiveau: { fr: string; en: string; } | null = null;
  selectedEtat: { fr: string; en: string; } | null = null;
  sortBy: string = '';

  constructor(
    private store: Store<AppState>,
    private formationService: FormationService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService
  ) {
    this.userRole$ = this.store.pipe(select(selectUserRole));
  }

  private langSub?: Subscription;

  ngOnInit(): void {
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.applyFilters();
    });
    this.loadFormations();
    this.initFormationForm();
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  isLoggedInAndAdmin(role: string | null): boolean {
    return role === 'ADMIN';
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

  getEtatValue(etat: { fr: string; en: string }): string {
    const lang = this.translate.currentLang === 'en' ? 'en' : 'fr';
    return etat[lang] || etat.fr;
  }

  getPrerequisValue(prerequis: string | { fr: string; en: string }): string {
    const lang = this.translate.currentLang === 'en' ? 'en' : 'fr';
    if (typeof prerequis === 'string') return prerequis;
    return prerequis[lang] || prerequis.fr;
  }

  getProgrammeValue(programme: string | { fr: string; en: string }): string {
    const lang = this.translate.currentLang === 'en' ? 'en' : 'fr';
    if (typeof programme === 'string') return programme;
    return programme[lang] || programme.fr;
  }

  // Helper functions for mapping between keys and objects
  getNiveauKey(niveau: { fr: string; en: string } | string): string {
    if (!niveau) return '';
    if (typeof niveau === 'string') return niveau;
    if (niveau.fr === 'Débutant' || niveau.en === 'Beginner') return 'BEGINNER';
    if (niveau.fr === 'Intermédiaire' || niveau.en === 'Intermediate') return 'INTERMEDIATE';
    if (niveau.fr === 'Avancé' || niveau.en === 'Advanced') return 'ADVANCED';
    return '';
  }

  getEtatKey(etat: { fr: string; en: string } | string): string {
    if (!etat) return '';
    if (typeof etat === 'string') return etat;
    if (etat.fr === 'En ligne' || etat.en === 'Online') return 'ONLINE';
    if (etat.fr === 'Présentiel' || etat.en === 'In-person') return 'IN_PERSON';
    return '';
  }

  getNiveauObject(key: string): { fr: string; en: string } {
    switch (key) {
      case 'BEGINNER': return { fr: 'Débutant', en: 'Beginner' };
      case 'INTERMEDIATE': return { fr: 'Intermédiaire', en: 'Intermediate' };
      case 'ADVANCED': return { fr: 'Avancé', en: 'Advanced' };
      default: return { fr: '', en: '' };
    }
  }

  getEtatObject(key: string): { fr: string; en: string } {
    switch (key) {
      case 'ONLINE': return { fr: 'En ligne', en: 'Online' };
      case 'IN_PERSON': return { fr: 'Présentiel', en: 'In-person' };
      default: return { fr: '', en: '' };
    }
  }

  initFormationForm(): void {
    this.formationForm = this.fb.group({
      titleFr: ['', Validators.required],
      titleEn: ['', Validators.required],
      descriptionFr: ['', Validators.required],
      descriptionEn: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      duree: ['', [Validators.required, Validators.min(1)]],
      nomFormateur: ['', Validators.required],
      etatFr: ['', Validators.required],
      etatEn: ['', Validators.required],
      niveauFr: ['', Validators.required],
      niveauEn: ['', Validators.required],
      prerequisFr: [''],
      prerequisEn: [''],
      programmeFr: [''],
      programmeEn: [''],
      dateDebut: [''],
      dateFin: [''],
      placesDisponibles: ['', [Validators.min(0)]]
    });
  }

  loadFormations(): void {
    this.isLoading = true;
    this.formationService.getAllFormations().subscribe({
      next: (data) => {
        this.formations = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Error fetching formations: ${error.message || 'Unknown error'}`;
        this.showError(this.errorMessage);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.formations];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(formation => {
        const titleMatch = this.getTitleValue(formation.title).toLowerCase().includes(searchLower);
        const descriptionMatch = this.getDescriptionValue(formation.description).toLowerCase().includes(searchLower);
        return titleMatch || descriptionMatch;
      });
    }

    // Apply niveau filter
    if (this.selectedNiveau) {
      filtered = filtered.filter(formation => {
        const niveauValue = this.getNiveauValue(formation.niveau);
        const selectedNiveauValue = this.getNiveauValue(this.selectedNiveau!);
        return niveauValue === selectedNiveauValue;
      });
    }

    // Apply etat filter
    if (this.selectedEtat) {
      filtered = filtered.filter(formation => {
        const etatValue = this.getEtatValue(formation.etat);
        const selectedEtatValue = this.getEtatValue(this.selectedEtat!);
        return etatValue === selectedEtatValue;
      });
    }

    // Apply sorting
    if (this.sortBy) {
      switch (this.sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => a.prix - b.prix);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.prix - a.prix);
          break;
        case 'duration_asc':
          filtered.sort((a, b) => a.duree - b.duree);
          break;
        case 'duration_desc':
          filtered.sort((a, b) => b.duree - a.duree);
          break;
      }
    }

    this.filteredFormations = filtered;
  }

  searchFormations(): void {
    this.applyFilters();
  }

  filterByNiveau(): void {
    this.applyFilters();
  }

  filterByEtat(): void {
    this.applyFilters();
  }

  // Formation details modal methods
  openDetails(formation: Formation): void {
    this.selectedFormation = formation;
  }

  closeDetails(): void {
    this.selectedFormation = null;
  }


  // Admin methods for managing formations
  openFormationForm(): void {
    this.editMode = false;
    this.formationForm.reset();
    this.initFormationForm();
    this.showFormationForm = true;
  }

  editFormation(formation: Formation, event: Event): void {
    event.stopPropagation();
    this.editMode = true;
    this.selectedFormation = formation;
    // Populate form with formation data using string keys for selects
    this.formationForm.patchValue({
      id: formation.id,
      titleFr: typeof formation.title === 'string' ? formation.title : formation.title.fr,
      titleEn: typeof formation.title === 'string' ? formation.title : formation.title.en,
      descriptionFr: typeof formation.description === 'string' ? formation.description : formation.description.fr,
      descriptionEn: typeof formation.description === 'string' ? formation.description : formation.description.en,
      prix: formation.prix,
      image: formation.image,
      duree: formation.duree,
      nomFormateur: formation.nomFormateur,
      etatFr: this.getEtatKey(formation.etat),
      etatEn: this.getEtatKey(formation.etat),
      niveauFr: this.getNiveauKey(formation.niveau),
      niveauEn: this.getNiveauKey(formation.niveau),
      active: (formation as any).active,
      dateDebut: formation.dateDebut,
      dateFin: formation.dateFin,
      placesDisponibles: formation.placesDisponibles,
      prerequisFr: typeof formation.prerequis === 'string' ? formation.prerequis : formation.prerequis.fr,
      prerequisEn: typeof formation.prerequis === 'string' ? formation.prerequis : formation.prerequis.en,
      programmeFr: typeof formation.programme === 'string' ? formation.programme : formation.programme.fr,
      programmeEn: typeof formation.programme === 'string' ? formation.programme : formation.programme.en
    });
    this.showFormationForm = true;
  }

  closeFormationForm(): void {
    this.showFormationForm = false;
    this.editMode = false;
    this.selectedFormation = null;
    this.formationForm.reset();
  }

  saveFormation(): void {
    if (this.formationForm.valid) {
      const formValue = this.formationForm.value;
      const formationData: Formation = {
        id: this.editMode ? this.selectedFormation?.id : undefined,
        title: {
          fr: formValue.titleFr,
          en: formValue.titleEn
        },
        description: {
          fr: formValue.descriptionFr,
          en: formValue.descriptionEn
        },
        prix: formValue.prix,
        image: formValue.image,
        duree: formValue.duree,
        nomFormateur: formValue.nomFormateur,
        etat: this.getEtatObject(formValue.etatFr), // map string key to object
        niveau: this.getNiveauObject(formValue.niveauFr), // map string key to object
        prerequis: {
          fr: formValue.prerequisFr,
          en: formValue.prerequisEn
        },
        programme: {
          fr: formValue.programmeFr,
          en: formValue.programmeEn
        },
        dateDebut: formValue.dateDebut,
        dateFin: formValue.dateFin,
        placesDisponibles: formValue.placesDisponibles
      };

      if (this.editMode && formationData.id) {
        this.formationService.updateFormation(formationData).subscribe({
          next: () => {
            this.showSuccess('Formation updated successfully');
            this.loadFormations();
            this.closeFormationForm();
          },
          error: (error) => {
            this.showError(`Error updating formation: ${error.message || 'Unknown error'}`);
          }
        });
      } else {
        this.formationService.addFormation(formationData).subscribe({
          next: () => {
            this.showSuccess('Formation created successfully');
            this.loadFormations();
            this.closeFormationForm();
          },
          error: (error) => {
            this.showError(`Error creating formation: ${error.message || 'Unknown error'}`);
          }
        });
      }
    } else {
      this.showError('Please fill all required fields correctly');
    }
  }

  deleteFormation(formation: Formation, event: Event): void {
    event.stopPropagation();
    this.formationToDelete = formation;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.formationToDelete = null;
  }

  confirmDelete(): void {
    if (this.formationToDelete && this.formationToDelete.id) {
      this.formationService.deleteFormation(this.formationToDelete.id).subscribe({
        next: () => {
          this.showSuccess('Formation deleted successfully');
          this.loadFormations();
          this.showDeleteConfirmation = false;
          this.formationToDelete = null;
        },
        error: (error) => {
          this.showError(`Error deleting formation: ${error.message || 'Unknown error'}`);
          this.showDeleteConfirmation = false;
          this.formationToDelete = null;
        }
      });
    }
  }

  // Utility methods for showing messages
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  showInfo(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}