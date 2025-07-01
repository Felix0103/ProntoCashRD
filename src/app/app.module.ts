import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PublicModule } from './public/public.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localeEsUS from '@angular/common/locales/es-US';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DatePipe, registerLocaleData } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PrivateModule } from './private/private.module';
import { AuthService } from './core/services/auth.service';
import { JWTInterceptorInterceptor } from './core/interceptors/jwtinterceptor.interceptor';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';

registerLocaleData(localeEsUS, 'es-US');

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent, TermsOfServiceComponent,
  PrivacyPolicyComponent],
  imports: [
    BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule,
    HttpClientModule, ToastrModule.forRoot({  positionClass: 'toast-bottom-center'}),
    BrowserAnimationsModule, PublicModule, PrivateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),

    NgxUiLoaderModule.forRoot({
      hasProgressBar: true,
      overlayColor: 'rgba(40,40,40,0.8)'
    }),
    IonicStorageModule.forRoot({   name: '__mydb_loan',
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]})
  ],
  providers: [ AuthService,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptorInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
      { provide: LOCALE_ID, useValue: 'es-US' },DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}




