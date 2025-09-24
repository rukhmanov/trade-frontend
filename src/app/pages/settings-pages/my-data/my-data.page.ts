import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon, IonAvatar, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { UserStateService } from 'src/app/state/user-state.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthImagePipe } from 'src/app/entities/auth/auth-image.pipe';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.page.html',
  styleUrls: ['./my-data.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,  IonIcon, IonButtons, IonBackButton, AuthImagePipe, IonAvatar]
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
    console.warn('URL изображения:', event.target?.src);
    console.warn('Данные пользователя:', this.userState.me$.value);
    this.avatarLoadError = true;
  }

  onImageLoad(event: any) {
    console.log('Аватар успешно загружен:', event.target?.src);
    this.avatarLoadError = false;
  }
}
