import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  timer = 0;
  constructor() {}
  private intervalId: any;

  sendCode() {
    this.timer = 60;

    // Очистить предыдущий таймер, если он был
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.timer--;

      if (this.timer <= 0) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.timer = 0;
      }
    }, 1000);
  }
}
