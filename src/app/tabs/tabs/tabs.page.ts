import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, inject } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonProgressBar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  triangle,
  ellipse,
  square,
  fileTrayStackedOutline,
  fileTrayFullOutline,
  cogOutline,
  logOutOutline,
} from 'ionicons/icons';
import { CommonStateService } from 'src/app/state/common-state.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [
    CommonModule,
    IonProgressBar,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  ],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(public commonStateService: CommonStateService) {
    addIcons({
      triangle,
      logOutOutline,
      ellipse,
      square,
      fileTrayStackedOutline,
      fileTrayFullOutline,
      cogOutline,
    });
  }
}
