import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { LoginPageRoutingModule } from './login-routing.module';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IonTitle, IonButtons, IonBackButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    IonicModule,
    IonTitle,
    IonButtons,
    IonBackButton,
  ],
})
export class LoginPage implements OnInit {
  credentials!: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.authService.login(this.credentials.value).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      },
      error: async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.error,
          buttons: ['OK'],
        });

        await alert.present();
      },
    });
  }

  // Getter for easy access to form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  // Method to navigate to the register page
  navigateToSignUp() {
    this.router.navigate(['/email-signup']);
  }
}
