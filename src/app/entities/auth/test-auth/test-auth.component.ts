import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonButton 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-auth',
  templateUrl: './test-auth.component.html',
  styleUrls: ['./test-auth.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton]
})
export class TestAuthComponent {
  constructor(private router: Router) {}

  goToUniversalAuth() {
    this.router.navigate(['/auth']);
  }

  goToCallback() {
    this.router.navigate(['/auth/callback'], {
      queryParams: { access_token: 'test_token_123' }
    });
  }

  goToCallbackWithError() {
    this.router.navigate(['/auth/callback'], {
      queryParams: { error: 'access_denied', error_description: 'User denied access' }
    });
  }
}
