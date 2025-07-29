import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { BackButtonComponent } from 'src/app/entities/back-button/back-button.component';

interface IUserAdmin {
  id: number;
  name: string;
  email: string;
  roles: string[];
}
const MOCK_USERS: IUserAdmin[] = [
  { id: 1, name: 'Иван Иванов', email: 'ivanov@mail.ru', roles: ['user'] },
  { id: 2, name: 'Петр Петров', email: 'petrov@mail.ru', roles: ['user', 'admin'] },
  { id: 3, name: 'Анна Смирнова', email: 'anna@mail.ru', roles: ['user', 'moderator'] },
];
const ALL_ROLES = ['user', 'admin', 'moderator'];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BackButtonComponent, IonButton, IonIcon]
})
export class AdminPage implements OnInit {
  users: IUserAdmin[] = [...MOCK_USERS];
  allRoles = ALL_ROLES;
  constructor() { }
  ngOnInit() {}
  removeUser(id: number) {
    this.users = this.users.filter(u => u.id !== id);
  }
  setRole(user: IUserAdmin, role: string) {
    if (user.roles.includes(role)) {
      user.roles = user.roles.filter(r => r !== role);
    } else {
      user.roles = [...user.roles, role];
    }
  }
  editRoles(user: IUserAdmin) {
    // Здесь можно открыть модальное окно для редактирования ролей
    console.log('Редактирование ролей для:', user.name);
  }
}
