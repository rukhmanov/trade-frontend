import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButton,
  IonTitle,
  IonContent,
  IonFooter,
  IonInput,
  IonList,
  IonItem,
  IonTextarea,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonChip,
  IonIcon,
  IonLabel,
  IonCheckbox,
  IonRange,
} from '@ionic/angular/standalone';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { Gender } from 'src/app/entities/auth/types';
import { GeodecoderComponent } from 'src/app/entities/custom-map/geodecoder/geodecoder.component';
import { MapComponent } from 'src/app/entities/custom-map/map/map.component';
// import { YandexMapComponent } from 'src/app/entities/yandex-map/yandex-map.component';
import { addIcons } from 'ionicons';
import { close, pin, informationCircleOutline } from 'ionicons/icons';
import { ImageGalleryComponent } from 'src/app/entities/image-preview/image-gallery.component';
import { MoneyFormatDirective } from '../../directives/money.directive';
import { TooltipPopoverComponent } from '../../entities/popup/popup.component';
import { ErrorTextPipe } from '../../pipes/error-text.pipe';
import { EventViewComponent } from 'src/app/entities/event-view/event-view.component';
import { CustomMapComponent } from 'src/app/entities/custom-map/custom-map.component';

@Component({
  selector: 'app-create-event-page',
  templateUrl: './create-event-page.component.html',
  styleUrls: ['./create-event-page.component.scss'],
  imports: [
    IonRange,
    IonCheckbox,
    IonLabel,
    IonIcon,
    IonChip,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonDatetime,
    IonTextarea,
    IonItem,
    IonList,
    IonInput,
    IonFooter,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImageGalleryComponent,
    MoneyFormatDirective,
    TooltipPopoverComponent,
    ErrorTextPipe,
    MapComponent,
    EventViewComponent,
    CustomMapComponent,
    // YandexMapComponent,
  ],
})
export class CreateEventPageComponent implements OnInit, OnDestroy {
  gender = Gender;
  destroy$ = new Subject();
  today = new Date().toJSON().split('T')[0];
  isOpen = false;
  images: any[] = [];
  mapData: any = null;

  geodecoder = new FormControl();
  linkControl = new FormControl();
  takeWithItemControlGroup = this.fb.group({
    item: '',
    isForAll: true,
  });

  form = this.fb.group({
    name: [null, [Validators.required, Validators.minLength(3)]],
    description: [null, [Validators.required, Validators.minLength(10)]],
    date: [null, Validators.required],
    // coordinate: null as null | [number, number],
    // coordinateTitle: null,
    // mapNote: null,
    additional: false,
    unlimitedMembersQuantity: true,
    membersQuantity: [{ value: 2, disabled: true }, [Validators.min(2)]],
    gender: null,
    ageFrom: [
      18,
      [Validators.required, Validators.min(18), Validators.max(99)],
    ],
    ageTo: [99, [Validators.required, Validators.min(18), Validators.max(99)]],
    withoutBudget: true,
    budgetForEvetyone: null,
    commonBudget: [{ value: 0, disabled: true }, Validators.required],
    myBudget: [0, Validators.required],
    myBudgetPercent: 0,
    amIPayAll: true,
    photos: null,
    takeWith: this.fb.array([]) as FormArray<FormControl<any>>,
    links: this.fb.array([]),
  });

  get takeWithArray(): FormArray {
    return this.form.get('takeWith') as FormArray;
  }

  get linksArray(): FormArray {
    return this.form.get('links') as FormArray;
  }

  @ViewChild('popover') popover!: HTMLIonPopoverElement;

  constructor(private fb: FormBuilder) {
    addIcons({
      close,
      pin,
      informationCircleOutline,
    });
  }

  ngOnInit(): void {
    this._subscribeToUnlimitedQuantityMembers().subscribe();
    this._subscribeToWithoutBudget().subscribe();
    this._subscribeToMyBudget().subscribe();
    this._subscribeToMyBudgetPersent().subscribe();
    this._subscribeToAdditional().subscribe();
    this._subscribeToAmIPayAll().subscribe();
    this._subscribeToCommonBudget().subscribe();
    // this.geodecoder.valueChanges.subscribe(console.log);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private _subscribeToUnlimitedQuantityMembers(): Observable<any> {
    return this.form.controls.unlimitedMembersQuantity.valueChanges.pipe(
      tap((isUnlimited) => {
        if (isUnlimited) {
          this.form.controls.membersQuantity.setValue(2, {
            emitEvent: false,
          });
          this.form.controls.membersQuantity.disable();
        } else {
          this.form.controls.membersQuantity.enable();
        }
        this.form.patchValue(
          {
            budgetForEvetyone: null,
            commonBudget: null,
            myBudget: null,
            myBudgetPercent: 0,
            amIPayAll: true,
          },
          { emitEvent: false }
        );
        this.form.controls.myBudget.reset();
      }),
      takeUntil(this.destroy$)
    );
  }

  private _subscribeToWithoutBudget(): Observable<any> {
    return this.form.controls.withoutBudget.valueChanges.pipe(
      tap((isWithoutBudget) => {
        if (isWithoutBudget) {
          this.setDefaultBudget();
          this.form.controls.commonBudget.disable();
        } else {
          if (
            !this.form.controls.membersQuantity.value &&
            !this.form.controls.unlimitedMembersQuantity.value
          ) {
            this.form.controls.withoutBudget.setValue(true, {
              emitEvent: false,
            });
          }
          this.form.controls.commonBudget.enable();
        }
      }),
      takeUntil(this.destroy$)
    );
  }

  setDefaultBudget(): void {
    this.form.patchValue(
      {
        commonBudget: 0,
        myBudget: 0,
        myBudgetPercent: 0,
        amIPayAll: true,
      },
      {
        emitEvent: false,
      }
    );
  }

  private _subscribeToMyBudget(): Observable<any> {
    return this.form.controls.myBudget.valueChanges.pipe(
      tap((myBudgetResp: any) => {
        const myBudget = myBudgetResp?.replace(' ', '');
        const commonBudget = (
          this.form.controls.commonBudget.value as any
        )?.replace(' ', '');
        if (commonBudget && myBudget) {
          if (+myBudget > +commonBudget) {
            this.form.controls.myBudget.setValue(commonBudget, {
              emitEvent: false,
            });
          }
          const pers = +myBudget / (+commonBudget / 100);
          this.form.controls.myBudgetPercent.setValue(pers, {
            emitEvent: false,
          });
        }
      }),
      takeUntil(this.destroy$)
    );
  }

  private _subscribeToCommonBudget(): Observable<any> {
    return this.form.controls.commonBudget.valueChanges.pipe(
      tap((commonBudgetResp: any) => {
        const commonBudget = commonBudgetResp;
        const myBudget = this.form.controls.myBudget.value as any;
        if (myBudget > commonBudget) {
          this.form.controls.myBudget.setValue(commonBudget, {
            emitEvent: false,
          });
        }
      }),
      takeUntil(this.destroy$)
    );
  }

  private _subscribeToAdditional(): Observable<any> {
    return this.form.controls.additional.valueChanges.pipe(
      tap(() => {
        this.form.patchValue({
          unlimitedMembersQuantity: true,
          membersQuantity: 2,
          gender: null,
          ageFrom: 18,
          ageTo: 99,
          withoutBudget: true,
          commonBudget: null,
          myBudget: null,
          myBudgetPercent: 0,
          amIPayAll: true,
          photos: null,
        });
        this.form.setControl('takeWith', this.fb.array([]));
        this.form.setControl('links', this.fb.array([]));
        this.form.controls.membersQuantity.disable();
        this.form.controls.commonBudget.disable();
        this.linkControl.reset();
        this.takeWithItemControlGroup.reset({
          item: '',
          isForAll: true,
        });
        this.images = [];
      }),
      takeUntil(this.destroy$)
    );
  }

  private _subscribeToMyBudgetPersent(): Observable<any> {
    return this.form.controls.myBudgetPercent.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap((myBudgetPersent) => {
        const commonBudget = (
          this.form.controls.commonBudget.value as any
        )?.replace(' ', '');
        if (commonBudget && myBudgetPersent) {
          const myBudget = (commonBudget / 100) * myBudgetPersent;
          this.form.controls.myBudget.setValue(myBudget, {
            emitEvent: false,
          });
        }
      }),
      takeUntil(this.destroy$)
    );
  }

  private _subscribeToAmIPayAll(): Observable<any> {
    return this.form.controls.amIPayAll.valueChanges.pipe(
      tap(() => {
        this.form.patchValue(
          {
            myBudget: null,
            myBudgetPercent: 0,
          },
          { emitEvent: false }
        );
      }),
      takeUntil(this.destroy$)
    );
  }

  pinFormatter(value: number) {
    return `${value}%`;
  }

  addTakeWithItem() {
    const value = this.takeWithItemControlGroup.controls.item.value;
    if (value) {
      this.takeWithArray.push(
        new FormControl({
          item: value,
          isForEveryone: this.takeWithItemControlGroup.controls.isForAll.value,
        })
      );
      this.takeWithItemControlGroup.get('item')?.reset();
    }
  }

  deleteTakeWithItem(index: number) {
    this.takeWithArray.removeAt(index);
  }

  changePhotos(value: any) {
    const file = value.target.files[0];
    const reader = new FileReader();
    reader.onloadend = (e) => {
      this.images.push(reader.result);
    };
    reader.readAsDataURL(file);
  }

  addLink() {
    const value = this.linkControl.value;
    if (value) {
      this.linksArray.push(new FormControl(value));
      this.linkControl.reset();
    }
  }

  deleteLink(index: number) {
    this.linksArray.removeAt(index);
  }

  blurAgeFrom() {
    const ageFrom = this.form.controls.ageFrom.value || 18;
    const ageTo = this.form.controls.ageTo.value || 99;
    if (ageFrom > 99) {
      this.form.controls.ageFrom.setValue(99, { emitEvent: false });
    }
    if (ageFrom < 18) {
      this.form.controls.ageFrom.setValue(18, { emitEvent: false });
    }
    if (ageFrom > ageTo) {
      this.form.controls.ageTo.setValue(ageFrom, {
        emitEvent: false,
      });
    }
  }

  blurAgeTo() {
    const ageFrom = this.form.controls.ageFrom.value || 18;
    const ageTo = this.form.controls.ageTo.value || 99;
    if (ageTo > 99) {
      this.form.controls.ageTo.setValue(99, { emitEvent: false });
    }
    if (ageTo < 18) {
      this.form.controls.ageTo.setValue(18, { emitEvent: false });
    }
    if (ageFrom > ageTo) {
      this.form.controls.ageFrom.setValue(ageTo, {
        emitEvent: false,
      });
    }
  }

  blurMembersQuantity() {
    const membersQuantity = this.form.controls.membersQuantity.value;
    if (
      typeof membersQuantity !== 'number' ||
      (typeof membersQuantity === 'number' && membersQuantity < 2)
    ) {
      this.form.controls.membersQuantity.setValue(2, {
        emitEvent: false,
      });
    }

    if (typeof membersQuantity === 'number' && membersQuantity > 1000) {
      this.form.controls.membersQuantity.setValue(1000, {
        emitEvent: false,
      });
    }
  }

  showEventPreview() {}

  onMapChange(event: any) {
    console.log(event);
    this.mapData = event;
  }
}
