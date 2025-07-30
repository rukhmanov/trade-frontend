import { Component, OnInit } from '@angular/core';
import { MapService } from './map/map.service';
import { MapComponent } from './map/map.component';
import { GeodecoderComponent } from './geodecoder/geodecoder.component';
import { IonTextarea } from '@ionic/angular/standalone';
import { TooltipPopoverComponent } from '../popup/popup.component';

@Component({
  selector: 'app-custom-map',
  templateUrl: './custom-map.component.html',
  styleUrls: ['./custom-map.component.scss'],
  imports: [
    IonTextarea,
    MapComponent,
    GeodecoderComponent,
    TooltipPopoverComponent,
  ],
})
export class CustomMapComponent implements OnInit {
  constructor(public mapService: MapService) {}

  ngOnInit(): void {
    // Component initialization logic can be added here if needed
  }

  onCoordinate(coordinates: [number, number]) {}
}
