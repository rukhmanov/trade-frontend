import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { IonPopover, IonContent, IonIcon } from '@ionic/angular/standalone';
import { informationCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-tooltip-popover',
  imports: [IonIcon, IonPopover, IonContent, CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class TooltipPopoverComponent {
  @ViewChild('popover') popover!: HTMLIonPopoverElement;
  @Input() text = '';
  isOpen = false;

  constructor(private el: ElementRef) {
    addIcons({
      informationCircleOutline,
    });
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  @HostListener('mouseenter', ['$event'])
  showTooltip() {
    this.el.nativeElement.title = this.text;
  }
}
