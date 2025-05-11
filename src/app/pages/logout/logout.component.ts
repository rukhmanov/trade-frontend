import { Component, OnInit } from '@angular/core';
import { AuthComponent } from 'src/app/entities/auth/auth.component';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  imports: [AuthComponent],
})
export class LogoutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
