import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon, IonAvatar } from '@ionic/angular/standalone';
import { UserStateService } from 'src/app/state/user-state.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BackButtonComponent } from 'src/app/entities/back-button/back-button.component';
import { AuthImagePipe } from 'src/app/entities/auth/auth-image.pipe';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.page.html',
  styleUrls: ['./my-data.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,  IonIcon, BackButtonComponent, AuthImagePipe, IonAvatar]
})
export class MyDataPage implements OnInit {
  public user$ = this.userState.me$;

  constructor(
    public userState: UserStateService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

}
