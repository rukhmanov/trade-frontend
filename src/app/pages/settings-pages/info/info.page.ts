import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonIcon, IonButton, IonChip } from '@ionic/angular/standalone';

import { 
  informationCircle, 
  statsChart, 
  call, 
  people, 
  documentText, 
  helpCircle, 
  shareOutline,
  mail,
  globe,
  code,
  calendar,
  bag,
  checkmarkCircle,
  helpBuoy,
  chatbubbleEllipses,
  refresh,
  openOutline,
  documentOutline,
  chatbubble,
  camera,
  logoFacebook,
  logoTwitter,
  logoYoutube,
  logoWhatsapp,
  logoLinkedin
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

interface ILegalDoc {
  title: string;
  url: string;
  description?: string;
}

interface IContact {
  label: string;
  value: string;
  type: 'email' | 'phone' | 'website' | 'address';
  icon?: string;
}

interface ISocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

interface IAppStat {
  label: string;
  value: string | number;
  icon?: string;
}

const MOCK_DOCS: ILegalDoc[] = [
  { 
    title: 'Пользовательское соглашение', 
    url: '/assets/docs/user-agreement.pdf',
    description: 'Условия использования платформы'
  },
  { 
    title: 'Политика конфиденциальности', 
    url: '/assets/docs/privacy-policy.pdf',
    description: 'Как мы обрабатываем ваши данные'
  },
  { 
    title: 'Правила продаж', 
    url: '/assets/docs/sales-rules.pdf',
    description: 'Правила размещения товаров'
  },
  { 
    title: 'Политика возврата', 
    url: '/assets/docs/return-policy.pdf',
    description: 'Условия возврата товаров'
  },
];

const SITE_INFO = `Платформа Parsifal — это современный сервис для обмена и продажи товаров, созданный для удобства пользователей. Мы стремимся создать безопасную и удобную среду для торговли.`;

const CONTACTS: IContact[] = [
  { label: 'Владелец', value: 'ИП Иванов И.И.', type: 'address' },
  { label: 'Email', value: 'info@parsifal.ru', type: 'email', icon: 'mail' },
  { label: 'Телефон', value: '+7 (999) 123-45-67', type: 'phone', icon: 'call' },
  { label: 'Сайт', value: 'https://parsifal.ru', type: 'website', icon: 'globe' },
  { label: 'Разработчик', value: 'aleksrukhmanov@gmail.com', type: 'email', icon: 'code' },
];

const SOCIAL_LINKS: ISocialLink[] = [
  { name: 'Telegram', url: 'https://t.me/parsifal_support', icon: 'chatbubble', color: '#0088cc' },
  { name: 'VK', url: 'https://vk.com/parsifal', icon: 'people', color: '#4a76a8' },
  { name: 'Instagram', url: 'https://instagram.com/parsifal', icon: 'camera', color: '#e4405f' },
  { name: 'Facebook', url: 'https://facebook.com/parsifal', icon: 'logo-facebook', color: '#1877f2' },
  { name: 'Twitter', url: 'https://twitter.com/parsifal', icon: 'logo-twitter', color: '#1da1f2' },
  { name: 'YouTube', url: 'https://youtube.com/parsifal', icon: 'logo-youtube', color: '#ff0000' },
  { name: 'WhatsApp', url: 'https://wa.me/79991234567', icon: 'logo-whatsapp', color: '#25d366' },
  { name: 'LinkedIn', url: 'https://linkedin.com/company/parsifal', icon: 'logo-linkedin', color: '#0077b5' },
];

const APP_STATS: IAppStat[] = [
  { label: 'Версия приложения', value: '1.2.0', icon: 'information-circle' },
  { label: 'Дата сборки', value: '2024-01-15', icon: 'calendar' },
  { label: 'Пользователей', value: '15,432', icon: 'people' },
  { label: 'Товаров', value: '8,967', icon: 'bag' },
  { label: 'Успешных сделок', value: '3,245', icon: 'checkmark-circle' },
];

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
    IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, 
    IonCardContent, IonList, IonItem, IonLabel, IonIcon, IonButton, 
    IonChip
  ]
})
export class InfoPage implements OnInit {
  docs = MOCK_DOCS;
  siteInfo = SITE_INFO;
  contacts = CONTACTS;
  socialLinks = SOCIAL_LINKS;
  appStats = APP_STATS;
  currentYear = new Date().getFullYear();

  constructor() {
    addIcons({
      informationCircle,
      statsChart,
      call,
      people,
      documentText,
      helpCircle,
      shareOutline,
      mail,
      globe,
      code,
      calendar,
      bag,
      checkmarkCircle,
      helpBuoy,
      chatbubbleEllipses,
      refresh,
      openOutline,
      documentOutline,
      chatbubble,
      camera,
      logoFacebook,
      logoTwitter,
      logoYoutube,
      logoWhatsapp,
      logoLinkedin
    });
  }

  ngOnInit() {}

  openUrl(url: string) {
    window.open(url, '_blank');
  }

  shareApp() {
    const message = 'Попробуйте Parsifal - удобную платформу для продажи и обмена товарами!';
    const url = 'https://parsifal.ru';

    if (navigator.share) {
      navigator.share({
        title: 'Parsifal - платформа для торговли',
        text: message,
        url: url
      });
    } else {
      // Fallback для браузеров без поддержки Web Share API
      const shareText = `${message}\n\n${url}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText);
        alert('Ссылка скопирована в буфер обмена!');
      } else {
        prompt('Скопируйте ссылку:', shareText);
      }
    }
  }

  contactAction(contact: IContact) {
    switch (contact.type) {
      case 'email':
        this.openUrl(`mailto:${contact.value}`);
        break;
      case 'phone':
        this.openUrl(`tel:${contact.value}`);
        break;
      case 'website':
        this.openUrl(contact.value);
        break;
    }
  }

  openDocument(doc: ILegalDoc) {
    this.openUrl(doc.url);
  }
}
