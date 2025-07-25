import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonLabel,
  IonContent,
  IonInput,
  IonTextarea,
  IonButton,
  IonSelectOption,
  IonSelect,
  IonActionSheet,
} from '@ionic/angular/standalone';
import { ImageGalleryComponent } from 'src/app/entities/image-preview/image-gallery.component';
import { Router } from '@angular/router';
import { MoneyFormatDirective } from 'src/app/directives/money.directive';
import { CreateCardPageApiService } from './services/create-card-page.service';
import { BehaviorSubject, concatMap, mergeMap, of } from 'rxjs';
import { ProductsApiService } from 'src/app/entities/cards/compact-card/services/cards-api.service';
import { CommonStateService } from 'src/app/state/common-state.service';

@Component({
  selector: 'app-create-card-page',
  templateUrl: './create-card-page.component.html',
  styleUrls: ['./create-card-page.component.scss'],
  imports: [
    IonActionSheet,
    IonButton,
    IonTextarea,
    IonInput,
    IonContent,
    IonLabel,
    IonItem,
    IonTitle,
    IonHeader,
    IonToolbar,
    IonSelectOption,
    IonSelect,
    ReactiveFormsModule,
    CommonModule,
    ImageGalleryComponent,
    FormsModule,
    MoneyFormatDirective,
  ],
})
export class CreateCardPageComponent implements OnInit {
  productForm!: FormGroup; // Формуляр продукта
  currencies: string[] = ['Рубль', 'Риал', 'Доллар', 'Евро']; // Возможные валюты
  imageFiles$ = new BehaviorSubject<File[] | any>([]);
  isActionSheetCancelOpen = false;
  isActionSheetSaveOpen = false;

  actionSheetButtonsCancel = [
    {
      text: 'Отменить и выйти',
      data: {
        action: 'exit',
      },
    },
    {
      text: 'Продолжить редактировать',
      data: {
        action: 'edit',
      },
    },
  ];

  actionSheetButtonsSave = [
    {
      text: 'Сохранить',
      data: {
        action: 'save',
      },
    },
    {
      text: 'Редактировать',
      data: {
        action: 'edit',
      },
    },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private createCardPageApiService: CreateCardPageApiService,
    private productsApiService: ProductsApiService,
    public commonStateService: CommonStateService
  ) {}

  ngOnInit(): void {
    // Инициализация формы с необходимыми валидаторами
    this.productForm = this.fb.group({
      name: ['', Validators.required], // Название продукта
      description: ['', Validators.required], // Описание продукта
      price: [null, [Validators.required, Validators.min(0)]], // Цена продукта
      weight: [null], // Вес продукта (необязательное поле)
      quantity: [1, [Validators.required, Validators.min(1)]], // Количество продукта
      currency: ['', Validators.required], // Валюта
      photos: null,
    });
  }

  changePhotos(event: any) {
    const file: File = event.target.files[0];
    this.imageFiles$.next([...this.imageFiles$.value, file]);
  }

  setOpenCancel(isOpen: boolean) {
    if (this.productForm.dirty) {
      this.isActionSheetCancelOpen = isOpen;
    } else {
      this.router.navigate(['tabs', 'my-cards']);
    }
  }

  action(e: any) {
    switch (e.detail.data.action) {
      case 'edit':
        break;
      case 'exit':
        this.router.navigate(['tabs', 'my-cards']);
        break;
      case 'save':
        this.commonStateService.pending$.next(true);
        this.productForm.disable();
        let upload$ = of([]);
        if (this.imageFiles$.value.length) {
          upload$ = this.createCardPageApiService.loadImages(
            this.imageFiles$.value
          );
        }
        upload$
          .pipe(
            mergeMap((images: any[] = []) => {
              const photos = images.map((image) => image.key);
              return this.createCardPageApiService.createProduct({
                ...this.productForm.getRawValue(),
                photos,
              });
            }),
            concatMap(() => this.productsApiService.getMyProducts())
          )
          .subscribe(
            () => {
              this.router.navigate(['tabs', 'my-cards']);
            },
            () => {},
            () => {
              this.commonStateService.pending$.next(false);
              this.productForm.enable();
            }
          );
        break;
    }
  }
}
