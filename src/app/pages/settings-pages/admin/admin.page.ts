import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonSpinner, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { BackButtonComponent } from 'src/app/entities/back-button/back-button.component';
import { AdminService, IUserAdmin } from 'src/app/services/admin.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BackButtonComponent, IonButton, IonIcon, IonSpinner, IonRefresher, IonRefresherContent]
})
export class AdminPage implements OnInit {
  users: IUserAdmin[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.getAllUsers()
      .pipe(
        catchError(error => {
          console.error('Ошибка загрузки пользователей:', error);
          this.errorMessage = 'Ошибка загрузки пользователей';
          return of({ status: -1, data: [] });
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        if (response.status === 0 && response.data) {
          this.users = response.data;
        }
      });
  }

  removeUser(id: number) {
    this.adminService.deleteUser(id)
      .pipe(
        catchError(error => {
          console.error('Ошибка удаления пользователя:', error);
          return of({ status: -1 });
        })
      )
      .subscribe(response => {
        if (response.status === 0) {
          this.users = this.users.filter(u => u.id !== id);
        }
      });
  }

  editRoles(user: IUserAdmin) {
    // Здесь можно открыть модальное окно для редактирования ролей
    console.log('Редактирование ролей для:', user.fullName || user.email);
  }

  handleRefresh(event: any) {
    this.loadUsers();
    event.target.complete();
  }

  getUserDisplayName(user: IUserAdmin): string {
    if (user.fullName) {
      return user.fullName;
    }
    if (user.firstName && user.secondName) {
      return `${user.firstName} ${user.secondName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    if (user.secondName) {
      return user.secondName;
    }
    return user.email;
  }

  getRoleNames(user: IUserAdmin): string[] {
    return user.roles.map(role => role.name);
  }
}
