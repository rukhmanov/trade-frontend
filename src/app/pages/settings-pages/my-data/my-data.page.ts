import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon, IonAvatar } from '@ionic/angular/standalone';
import { UserStateService } from 'src/app/state/user-state.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BackButtonComponent } from 'src/app/entities/back-button/back-button.component';
import { AuthImagePipe } from 'src/app/entities/auth/auth-image.pipe';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.page.html',
  styleUrls: ['./my-data.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,  IonIcon, BackButtonComponent, AuthImagePipe, IonAvatar]
})
export class MyDataPage implements OnInit {
  public user$ = this.userState.me$;
  public avatarLoadError = false;

  constructor(
    public userState: UserStateService,
    private sanitizer: DomSanitizer
  ) {
    addIcons({
      personCircleOutline
    });
  }

  ngOnInit() {
  }

  onImageError(event: any) {
    console.warn('Ошибка загрузки аватара:', event);
    this.avatarLoadError = true;
  }

  onImageLoad(event: any) {
    this.avatarLoadError = false;
  }
}
