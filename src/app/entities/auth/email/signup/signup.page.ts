import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { SignupPageRoutingModule } from './signup-routing.module';
import { AuthenticationService } from '../services/authentication.service';
import { IonicModule } from '@ionic/angular';
import { BackButtonComponent } from 'src/app/entities/back-button/back-button.component';
import { PhoneInputComponent } from 'src/app/entities/phone-input/phone-input.component';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { map, Observable } from 'rxjs';
import { IonTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  standalone: true,
  styleUrls: ['./signup.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    SignupPageRoutingModule,
    ReactiveFormsModule,
    IonicModule,
    BackButtonComponent,
    PhoneInputComponent,
    IonTitle,
  ],
})
export class SignupPage implements OnInit {
  credentials!: FormGroup;
  showPassword = false;
  passwordMismatch = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) {
    addIcons({
      eyeOutline,
      eyeOffOutline,
    });
  }

  ngOnInit() {
    this.credentials = this.fb.group(
      {
        email: this.fb.control('', {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.isEmailExists()],
          // updateOn: 'blur', // 👈 запускать валидацию только при потере фокуса
        }),
        firstName: ['', [Validators.required]],
        secondName: ['', [Validators.required]],
        phone: ['', [Validators.required, this.phoneLength()]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validators: this.matchingPasswords('password', 'confirmPassword'),
      }
    );
  }

  async onSubmit() {
    // TODO: Add your sign-up logic here
    const loading = await this.loadingController.create();
    await loading.present();
    this.authService.register(this.credentials.value).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('/email-confirm', { replaceUrl: true });
      },
      error: async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Signup failed',
          message: res,
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

  get firstName() {
    return this.credentials.get('firstName');
  }

  get secondName() {
    return this.credentials.get('secondName');
  }

  get phone() {
    return this.credentials.get('phone');
  }

  get password() {
    return this.credentials.get('password');
  }

  get confirmPassword() {
    return this.credentials.get('confirmPassword');
  }

  phoneLength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value?.phone?.length === 10 ? null : { phoneLength: true };
    };
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        this.passwordMismatch = true;
      } else {
        this.passwordMismatch = false;
      }
    };
  }

  isEmailExists(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<ValidationErrors | null>
      | Observable<ValidationErrors | null> => {
      return this.authService.checkEmailExists(control.value).pipe(
        map(({ exists }: any) => {
          return exists ? { isEmailExists: true } : null;
        })
      );
    };
  }
}
