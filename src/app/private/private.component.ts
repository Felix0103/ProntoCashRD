import { HistoryHelperService } from './../core/utils/history-helper.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@capacitor/splash-screen';

import { AuthService } from '../core/services/auth.service';
import { User } from '../core/interfaces/user-interface';
import { NavController, MenuController } from '@ionic/angular';


@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: [
    './side-menu/styles/side-menu.scss',
    './side-menu/styles/side-menu.shell.scss',
    './side-menu/styles/side-menu.responsive.scss'
  ],
  standalone: false
})
export class PrivateComponent {
  appPages: any[] = [];
  accountPages: any[] = [];
  reportPages: any[] = [ ];

  textDir = 'ltr';
  user!: User;
  // Inject HistoryHelperService in the app.components.ts so its available app-wide
  constructor(
    public translate: TranslateService,
    public historyHelper: HistoryHelperService,
    private router: Router,
    public authService: AuthService,
    private navCtrl: NavController,
    private menuController: MenuController
  ) {
    this.initializeApp();
    this.setLanguage();



  }
removeFocus(){
  document.activeElement instanceof HTMLElement && document.activeElement.blur();
}
  async initializeApp() {
    try {
      await SplashScreen.hide();
    } catch (err) {
      console.log('This is normal in a browser', err);
    }

    this.user = await  this.authService.getUser(true);

     if (this.user.permissions.includes('view_loan_types')){
      this.accountPages.push(  {
        title: 'Tipos de Prestamos',
        url: '/loan-types',
        ionicIcon: 'list-outline',
        customIcon: ''
      } );
    }

    if (this.user.permissions.includes('view_product')){
      this.accountPages.push(  {
        title: 'Productos',
        url: '/products',
        ionicIcon: 'list-outline',
        customIcon: ''
      } );
    }
    if (this.user.permissions.includes('view_category')){
      this.accountPages.push( {
        title: 'Categorias',
        url: '/product-categories',
        ionicIcon: 'list-outline',
        customIcon: ''
      });
    }
    if (this.user.permissions.includes('view_warehouse')){
      this.accountPages.push( {
        title: 'Almacenes',
        url: '/warehouse',
        ionicIcon: 'business-outline',
        customIcon: ''
      });
    }
    if (this.user.permissions.includes('view_user')){
      this.accountPages.push(  {
        title: 'Usuarios',
        url: '/user',
        ionicIcon: 'people',
        customIcon: ''
      });
    }

    if(this.user.permissions.includes('view_dashboard')){
      this.appPages.push(   {
        title: 'Dashboard',
        url: '/dashboard',
        ionicIcon: 'speedometer-outline',
         customIcon: ''
      });
    }
    if(this.user.permissions.includes('view_loan')){
      this.appPages.push( {
        title: 'Cobrar prestamo',
        url: '/loans/pending',
        ionicIcon: 'alert-circle-outline',
        customIcon: ''
      });
    }
    if(this.user.permissions.includes('view_loan')){
      this.appPages.push( {
        title: 'Prestamos',
        url: '/loans',
        ionicIcon: 'cash-outline',
        customIcon: ''
      });
    }
    if(this.user.permissions.includes('view_client')){
      this.appPages.push( {
        title: 'Clientes',
        url: '/clients',
        ionicIcon: 'person-outline',
        customIcon: ''
      });
    }


    if(this.user.permissions.includes('view_invoice')){
      this.appPages.push({
        title: 'Facturación',
        url: '/invoice',
        ionicIcon: 'receipt-outline',
         customIcon: ''
      });
    }
    if(this.user.permissions.includes('view_inventory')){
      this.appPages.push({
        title: 'Inventarios',
        url: '/inventory',
        ionicIcon: 'list-outline',
         customIcon: ''
      });
    }
    if(this.user.permissions.includes('view_sales_report')){
      this.reportPages.push( {
        title: 'Reporte de ventas',
        url: '/sales-report',
        ionicIcon: 'bar-chart-outline',
        customIcon: ''
      });
    }
     if(this.user.permissions.includes('view_client_in_arrears')){
      this.reportPages.push( {
        title: 'Clientes en Atraso',
        url: '/reports/arrears',
        ionicIcon: 'alert-circle-outline',
        customIcon: ''
      });
    }
    if(this.user.permissions.includes('view_account_balance')){
      this.reportPages.push( {
        title: 'Cuenta por Cobrar',
        url: '/reports/account/balance',
        ionicIcon: 'file-tray-full-outline',
        customIcon: ''
      });
    }
     if(this.user.permissions.includes('view_incomes')){
      this.reportPages.push( {
        title: 'Cobros',
        url: '/loans/payments',
        ionicIcon: 'swap-horizontal-outline',
        customIcon: ''
      });
    }
  }

  public setLanguage(): void {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');

    // this is to determine the text direction depending on the selected language
    // for the purpose of this example we determine that only arabic and hebrew are RTL.
    // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   this.textDir = (event.lang === 'ar' || event.lang === 'iw') ? 'rtl' : 'ltr';
    // });
  }


  logOut(){
    this.authService.logout();
  }
  navegateTo(url:string){
    document.activeElement instanceof HTMLElement && document.activeElement.blur();
    this.navCtrl.navigateRoot([url]);
  }
}
