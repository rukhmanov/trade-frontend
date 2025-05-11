import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, Service } from '../types';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-remote-login',
  templateUrl: './remote-login.component.html',
  styleUrls: ['./remote-login.component.scss'],
})
export class RemoteLoginComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const params = this.route.snapshot?.queryParams;
    const { platform, service } = params;
    if (platform in Platform && service in Service) {
      localStorage.setItem('platform', platform);
      localStorage.setItem('service', service);
      switch (platform) {
        case Platform.web:
          if (service === Service.yandex) {
            this.authService.yandexLogin();
          } else if (service === Service.google) {
          }
          break;
        case Platform.ios:
          break;
        case Platform.android:
          break;
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}
//http://localhost:8100/remote-login?platform=web&service=yandex&token=123
