import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, OnInit, signal } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { distinctUntilChanged, firstValueFrom, map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UserDetails } from './shared/interface/user';

import { ActivitiesService } from './activities/activities.service';
import { EnquiriesService } from './enquiries/enquiries.service';
import { StorageService } from './shared/services/storage/storage.service';
import { UserService } from './user/user.service';
import { WebSocketService } from './web-scoket/web-socket.service';
import { Enquiry } from './shared/interface/enquiry';

// Register swiper js
import { register } from 'swiper/element/bundle';
import { addIcons } from 'ionicons';
import {
  add,
  addOutline,
  addCircleOutline,
  alertCircleOutline,
  archiveOutline,
  arrowBackOutline,
  arrowRedo,
  arrowUpOutline,
  bookmarkOutline,
  briefcaseSharp,
  calculatorOutline,
  calculatorSharp,
  calendarNumberOutline,
  cashOutline,
  chatbubbleEllipsesOutline,
  chevronForwardOutline,
  checkmarkCircle,
  closeCircle,
  closeOutline,
  cogOutline,
  cogSharp,
  createOutline,
  createSharp,
  ellipsisVerticalOutline,
  flagOutline,
  gridOutline,
  helpCircleOutline,
  helpCircleSharp,
  helpOutline,
  homeOutline,
  homeSharp,
  imageOutline,
  imagesOutline,
  locateOutline,
  lockClosedOutline,
  logInOutline,
  logInSharp,
  logOutOutline,
  logOutSharp,
  mapOutline,
  mapSharp,
  moon,
  notifications,
  notificationsOff,
  notificationsOutline,
  optionsOutline,
  personCircleOutline,
  personOutline,
  personSharp,
  pencilOutline,
  readerOutline,
  readerSharp,
  reorderFourOutline,
  searchOutline,
  sunny,
  trash,
  trashOutline
} from 'ionicons/icons';
import { NotificationsService } from './user/notifications/notifications.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { errorHandler } from './shared/utility/requests';

register();

addIcons({
  add,
  addOutline,
  addCircleOutline,
  alertCircleOutline,
  archiveOutline,
  arrowBackOutline,
  arrowRedo,
  arrowUpOutline,
  bookmarkOutline,
  briefcaseSharp,
  calculatorOutline,
  calculatorSharp,
  calendarNumberOutline,
  cashOutline,
  chatbubbleEllipsesOutline,
  chevronForwardOutline,
  checkmarkCircle,
  closeCircle,
  closeOutline,
  cogOutline,
  cogSharp,
  createOutline,
  createSharp,
  ellipsisVerticalOutline,
  flagOutline,
  gridOutline,
  helpCircleOutline,
  helpCircleSharp,
  helpOutline,
  homeOutline,
  homeSharp,
  imageOutline,
  imagesOutline,
  locateOutline,
  lockClosedOutline,
  logInOutline,
  logInSharp,
  logOutOutline,
  logOutSharp,
  mapOutline,
  mapSharp,
  moon,
  notifications,
  notificationsOff,
  notificationsOutline,
  optionsOutline,
  personCircleOutline,
  personOutline,
  personSharp,
  pencilOutline,
  readerOutline,
  readerSharp,
  reorderFourOutline,
  searchOutline,
  sunny,
  trash,
  trashOutline
});

interface NavLinks {
  title: string;
  url: string;
  icon: string;
  signIn?: boolean;
  guest?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  public appPages: NavLinks[] = [
    { title: 'Map', url: '/map', icon: 'map' },
    { title: 'Properties', url: '/properties', icon: 'home' },
    { title: 'Enquiries', url: '/enquiries', icon: 'reader' },
    { title: 'Mortgage Calc', url: '/mortgage-calc', icon: 'calculator' },
    { title: 'Settings', url: '/settings', icon: 'cog' }
  ];

  public unreadEnquiries = toSignal(
    this.enquiriesService.enquiries$.pipe(
      map((enquiries) => enquiries.filter((item) => this.isUnread(item)).length)
    ),
    { initialValue: 0 }
  );

  public unreadNotifications = toSignal(
    this.notificationsService.notifications$.pipe(
      map((notifications) => notifications.filter((item) => !item.read).length)
    ),
    { initialValue: 0 }
  );

  public user = signal<UserDetails | undefined>(undefined);
  private connectedUserToken = '';
  private authenticatedInitialization?: Promise<void>;

  public appLowerPages = computed<NavLinks[]>(() => {
    const pages = [
      { title: 'Help & Support', url: '/help-support', icon: 'help-circle' }
    ];
    if (this.user()) {
      return [
        ...pages,
        { title: 'Management', url: '/management', icon: 'briefcase' },
        { title: 'Account', url: '/user/account', icon: 'person' }
      ];
    }
    return [
      ...pages,
      { title: 'Register', url: '/user/register', icon: 'create' },
      { title: 'Sign In', url: '/user/signin', icon: 'log-in' }
    ];
  });

  constructor(
    private platform: Platform,
    private storage: StorageService,
    private userService: UserService,
    private alertController: AlertController,
    private toastController: ToastController,
    private http: HttpClient,
    private enquiriesService: EnquiriesService,
    private activitiesService: ActivitiesService,
    private webSocket: WebSocketService,
    private notificationsService: NotificationsService,
    private destroyRef: DestroyRef
  ) {}

  async ngOnInit() {
    await this.platform.ready();
    await this.storage.init();
    await this.userService.sessionReady;
    const isDark = await this.storage.getDartTheme();
    // SET THEME
    if (isDark) {
      document.documentElement.classList.add('ion-palette-dark');
      document.body.classList.add('dark');
    }
    this.userService.user$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(
          (previous, current) => previous?.accessToken === current?.accessToken
        )
      )
      .subscribe((user) => {
        if (!user) {
          console.log('Unkown User...');
          this.user.set(undefined);
          this.webSocket.disconnect();
          this.connectedUserToken = '';

          this.enquiriesService.resetState();
          this.notificationsService.resetState();
          this.activitiesService.resetState();
          return;
        }
        void this.initializeAuthenticatedUser();
      });
    this.checkServer();
  }

  public isHidden(link: NavLinks): boolean {
    if (link.signIn) {
      return !this.user();
    }
    if (link.guest) {
      return !!this.user();
    }
    return false;
  }

  public async signOut(): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure?',
      message: 'You will be Signed out!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Sign out',
          cssClass: 'danger',
          handler: async () => {
            await this.userService.signOut();
            this.showSignedOutToast();
          }
        }
      ]
    });
    await alert.present();
  }

  private async setUserProfile(): Promise<void> {
    try {
      const res = await firstValueFrom(this.userService.getCurrentUser());
      if (res.status === 200 && res.data) {
        this.user.set(res.data);
      }
    } catch (error: unknown) {
      if (
        error instanceof HttpErrorResponse &&
        [401, 403].includes(error.status)
      ) {
        await this.userService.signOut();
        return;
      }
      if (error instanceof HttpErrorResponse) {
        const { message } = errorHandler(error);
        this.toastController
          .create({
            message,
            color: 'danger',
            duration: 5000
          })
          .then((toast) => toast.present());
      }
      console.error('Get Current User error:', error);
    }
  }

  private initializeAuthenticatedUser(): Promise<void> {
    if (!this.authenticatedInitialization) {
      this.authenticatedInitialization = this.loadAuthenticatedUser().finally(
        () => (this.authenticatedInitialization = undefined)
      );
    }
    return this.authenticatedInitialization;
  }

  private async loadAuthenticatedUser(): Promise<void> {
    console.log('Fetching user details...');
    await this.setUserProfile();
    if (!this.userService.user) {
      return;
    }

    await Promise.all([
      this.fetchActivities(),
      this.fetchEnquiries(),
      this.fetchNotifications()
    ]);

    const userToken = this.userService.token;
    if (userToken && userToken !== this.connectedUserToken) {
      this.webSocket.connect(userToken);
      this.connectedUserToken = userToken;
    }
  }

  private async fetchEnquiries(): Promise<void> {
    if (this.enquiriesService.initialFetchDone()) {
      return;
    }
    this.enquiriesService.initialFetchDone.set(true);

    try {
      const res = await firstValueFrom(this.enquiriesService.fetchEnquiries());
      if (res?.status === 200 && res?.data) {
        this.enquiriesService.enquiries = res.data;
      }
    } catch (error: unknown) {
      const message =
        error instanceof HttpErrorResponse
          ? errorHandler(error).message
          : 'Unable to load enquiries. Please try again.';
      this.toastController
        .create({ message, color: 'danger', duration: 5000 })
        .then((toast) => toast.present());
      console.error('Error fetching enquiries:', error);
    }
  }

  private async fetchActivities(): Promise<void> {
    if (this.activitiesService.initialFetchDone()) {
      return;
    }
    this.activitiesService.initialFetchDone.set(true);

    try {
      const res = await firstValueFrom(
        this.activitiesService.fetchActivities()
      );
      if (res?.status === 200) {
        this.activitiesService.activities = res.data || [];
      }
    } catch (error: unknown) {
      const message =
        error instanceof HttpErrorResponse
          ? errorHandler(error).message
          : 'Unable to load activities. Please try again.';
      this.toastController
        .create({ message, color: 'danger', duration: 5000 })
        .then((toast) => toast.present());
      console.error('Error fetching activities:', error);
    }
  }

  private async fetchNotifications(): Promise<void> {
    if (this.notificationsService.initialFetchDone()) {
      return;
    }
    this.notificationsService.initialFetchDone.set(true);

    try {
      const res = await firstValueFrom(
        this.notificationsService.fetchNotifications()
      );
      if (res?.status === 200) {
        this.notificationsService.notifications = res.data || [];
      }
    } catch (error: unknown) {
      const message =
        error instanceof HttpErrorResponse
          ? errorHandler(error).message
          : 'Unable to load notifications. Please try again.';
      this.toastController
        .create({ message, color: 'danger', duration: 5000 })
        .then((toast) => toast.present());
      console.error('Error fetching notifications:', error);
    }
  }

  private async showSignedOutToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Success, you have signed out.',
      color: 'success',
      duration: 3000
    });
    toast.present();
  }

  private checkServer(): void {
    firstValueFrom(
      this.http.get<null | { message: string; success: boolean }>(
        environment.api.server
      )
    )
      .then((data) => console.log(data))
      .catch((error: unknown) => {
        const message =
          error instanceof HttpErrorResponse
            ? errorHandler(error).message
            : 'Unable to reach the server. Please try again later.';
        this.toastController
          .create({ message, color: 'danger', duration: 5000 })
          .then((toast) => toast.present());
      });
  }

  private isUnread(enquiry: Enquiry) {
    return !enquiry.read && enquiry.users.to.user_id === this.user()?.user_id;
  }
}
