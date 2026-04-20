import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { AuthComponent } from './shared/components/auth/auth.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { SimplebarAngularModule } from 'simplebar-angular';
import { AuthInterceptor } from './shared/auth/auth-interceptor.service';
import { ImageFallbackDirective } from './shared/directive/img-fallback.directive';
import { LandingPageComponent } from './shared/components/landing-page/landing-page.component';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent, AuthComponent, LandingPageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    NgZorroAntdModule,
    OAuthModule.forRoot(),
    SimplebarAngularModule,
    ReactiveFormsModule,
    ImageFallbackDirective,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    provideZoneChangeDetection({
      eventCoalescing: false,
      runCoalescing: false,
    }),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [ImageFallbackDirective],
})
export class AppModule {}
