import { ErrorHandler, Inject, Injectable, InjectionToken, NgModule  } from '@angular/core';
import {
  BrowserModule,
  BrowserTransferStateModule,
} from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './pages/home/home.module';
import { SharedModule } from './_shared/shared.module';
import { AppComponent } from './app.component';
import { MonthlyCoversModule } from './pages/monthly-covers/monthly-covers.module';
import { AboutUsModule } from './pages/about-us/about-us.module';
import { BrandModule } from './pages/brand/brand.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonthlyDetailsModule } from './pages/monthly-details/monthly-details.module';
import { GoogleAnalyticsService } from './google-analytics.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    TransferHttpCacheModule,
    AppRoutingModule,
    SharedModule,
    HomeModule,
    HttpClientModule,
    MonthlyCoversModule,
    AboutUsModule,
    BrandModule,
    CommonModule,
    BrowserAnimationsModule,
    MonthlyDetailsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.enableSW,
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    GoogleAnalyticsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
