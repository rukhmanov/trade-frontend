import { Component, Input, OnInit } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CommonStateService } from 'src/app/state/common-state.service';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  imports: [IonIcon, IonButton],
})
export class BackButtonComponent implements OnInit {
  @Input() tab: 'all' | 'cart' | 'settings' | null = null;
  backToMain = true;

  constructor(
    private location: Location,
    private router: Router,
    private commonStateService: CommonStateService
  ) {}

  ngOnInit(): void {
    // Component initialization logic can be added here if needed
  }

  back() {
    if (this.tab) {
      this.router.navigate(['tabs', this.tab]);
      this.commonStateService.pendingByTime();
    } else {
      this.location.back();
    }
  }
}
