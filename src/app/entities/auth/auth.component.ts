import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { UserStateService } from 'src/app/state/user-state.service';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import {
  IonButton,
  IonText,
  IonIcon,
  IonChip,
  IonAvatar,
  IonLabel,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthImagePipe } from './auth-image.pipe';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    IonLabel,
    IonAvatar,
    IonChip,
    IonIcon,
    IonText,
    IonButton,
    CommonModule,
    FormsModule,
    AuthImagePipe,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(
    public authService: AuthService,
    public router: Router,
    public userState: UserStateService
  ) {
    addIcons({
      logOutOutline
    });
  }

  async loginWithEmail() {
    this.errorMessage = null; // Reset error message
    try {
      await this.authService.signInWithEmail(this.email, this.password);
      this.router.navigate(['tabs', 'all']); // Redirect on success
    } catch (error: any) {
      this.errorMessage = error.message; // Set error message on failure
    }
  }

  emailLoginPage(): void {
    this.router.navigate(['email-login']);
  }
}
