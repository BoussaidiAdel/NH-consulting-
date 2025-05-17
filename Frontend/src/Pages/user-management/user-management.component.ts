import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RegistreUser, User } from '../../Models/User';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../Utils/app.state';
import { UserService } from '../../Services/user.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone : false,
  templateUrl: './user-management.component.html',  
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  userForm: FormGroup;
  isEditing = false;
  showAddForm = false;
  editingUserId: string | null = null;
  userId!: string;
  userId$: Observable<string | null>;

  // BehaviorSubjects to store data
  private usersSubject = new BehaviorSubject<User[]>([]);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  // Observables for the template
  users$ = this.usersSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  isAdmin$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.userForm = this.createUserForm();
    
    this.isAdmin$ = this.store.pipe(select(state => state.auth.role === 'ADMIN'));
    this.userId$ = this.store.pipe(select(state => state.auth.userId));
  }

  ngOnInit(): void {
    this.loadUsers();
    this.userId$.subscribe(id => {
      this.userId = id!;
    });
    this.loadCurrentUser();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        console.log(params['id']);
      }
    });
  }

  loadUsers(): void {
    this.loadingSubject.next(true);
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.usersSubject.next(users);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loadingSubject.next(false);
      }
    });
  }

  loadCurrentUser(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
      },
      error: (error) => {
        console.error('Error loading current user:', error);
      }
    });
  }

  createUserForm(user?: User): FormGroup {
    if (user) {
      // Creating form for existing user (editing mode)
      return this.fb.group({
        firstName: [user.firstName || '', Validators.required],
        lastName: [user.lastName || '', Validators.required],
        email: [user.email || '', [Validators.required, Validators.email]],
        password: [''], // Empty for existing users
        role: [user.role || 'USER', Validators.required],
        verified: [user.verified || false]
      });
    } else {
      // Creating form for new user (create mode) - no role or verified fields
      return this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      });
    }
  }

  startAddUser(): void {
    this.userForm = this.createUserForm(); // This will create a form without role/verified
    this.isEditing = false;
    this.showAddForm = true;
    this.editingUserId = null;
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.isEditing = false;
    this.editingUserId = null;
  }

  startEditCurrentUser(user: User): void {
    this.userForm = this.createUserForm(user);
    this.isEditing = true;
    this.editingUserId = user.id;
  }

  startEditUser(user: User): void {
    this.userForm = this.createUserForm(user);
    this.isEditing = true;
    this.showAddForm = true;
    this.editingUserId = user.id;
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValues = this.userForm.value;
    
    // If password is empty and editing, remove it from the payload
    if (this.isEditing && !formValues.password) {
      delete formValues.password;
    }

    if (this.isEditing && this.editingUserId) {
      // Update existing user
      this.loadingSubject.next(true);
      const updatedUser: User = { ...formValues, id: this.editingUserId };
      
      this.userService.updateUser(this.editingUserId, updatedUser).subscribe({
        next: (user) => {
          // Update the user in the list
          const users = this.usersSubject.value;
          const updatedUsers = users.map(u => u.id === user.id ? user : u);
          this.usersSubject.next(updatedUsers);
          
          // If current user was updated, update that too
          const currentUser = this.currentUserSubject.value;
          if (currentUser && currentUser.id === user.id) {
            this.currentUserSubject.next(user);
          }
          
          this.loadingSubject.next(false);
          this.cancelForm();
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.loadingSubject.next(false);
        }
      });
    } else {
      // Create new user - use RegistreUser model
      this.loadingSubject.next(true);
      
      const newUser: RegistreUser = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        password: formValues.password
      };
      
      this.authService.register(newUser).subscribe({
        next: (user) => {
          // Add the new user to the list
          const users = this.usersSubject.value;
          this.usersSubject.next([...users, user]);
          
          this.loadingSubject.next(false);
          this.cancelForm();
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.loadingSubject.next(false);
        }
      });
    }
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.loadingSubject.next(true);
      
      this.userService.deleteUser(id).subscribe({
        next: () => {
          // Remove the user from the list
          const users = this.usersSubject.value;
          this.usersSubject.next(users.filter(u => u.id !== id));
          
          this.loadingSubject.next(false);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.loadingSubject.next(false);
        }
      });
    }
  }
}