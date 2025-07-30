import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnInit,
} from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./image-slider.component.scss'],
  imports: [CommonModule],
})
export class ImageSliderComponent implements OnInit {
  s3 = environment.s3;

  @Input() images: string[] = [];
  swiperModules = [IonicSlides];

  constructor() {}

  ngOnInit(): void {
    // Component initialization logic can be added here if needed
  }
}
