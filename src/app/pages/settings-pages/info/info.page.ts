import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/angular/standalone';

interface ILegalDoc {
  title: string;
  url: string;
}

const MOCK_DOCS: ILegalDoc[] = [
  { title: 'Пользовательское соглашение', url: '/assets/docs/user-agreement.pdf' },
  { title: 'Политика конфиденциальности', url: '/assets/docs/privacy-policy.pdf' },
];

const SITE_INFO = `Платформа Parsifal — это современный сервис для обмена и продажи товаров.`;
const CONTACTS = [
  { label: 'Владелец', value: 'ИП Иванов И.И., info@parsifal.ru' },
  { label: 'Разработчик', value: 'aleksrukhmanov@gmail.com' },
];

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton]
})
export class InfoPage implements OnInit {
  docs = MOCK_DOCS;
  siteInfo = SITE_INFO;
  contacts = CONTACTS;
  constructor() { }
  ngOnInit() {}
}
