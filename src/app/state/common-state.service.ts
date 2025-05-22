import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { LoadingController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class CommonStateService {
  loading: any = null;
  pending$ = new BehaviorSubject<boolean>(false);

  constructor(private loadingCtrl: LoadingController) {
    this.pending$
      .pipe(
        tap((resp) => {
          console.log(resp);
          if (resp) {
            this.showLoading();
          } else {
            this.dismissLoading();
          }
        })
      )
      .subscribe();
  }

  dismissLoading() {
    this.loading?.dismiss();
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Подождите...',
      cssClass: 'custom-loading',
      animated: true,
    });

    this.loading.present();
  }

  pendingByTime(ms: number = 700) {
    this.pending$.next(true);
    setTimeout(() => {
      this.pending$.next(false);
    }, ms);
  }
}
