import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SitemapComponent } from './pages/sitemap/sitemap.component';
import { TermsofuseComponent } from './pages/termsofuse/termsofuse.component';
import { MonthlyCoversComponent } from './pages/monthly-covers/monthly-covers.component';
import { ErrorComponent } from './_shared/components/error/error.component';
import { AwardsComponent } from './pages/awards/awards.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'sitemap',
    component: SitemapComponent,
    loadChildren:() => import ('./pages/sitemap/sitemap.module').then((m) => m.SitemapModule),
  },
  {
    path: 'termsofuse',
    component: TermsofuseComponent,
    loadChildren:() => import ('./pages/termsofuse/termsofuse.module').then((m) => m.TermsofuseModule),
  },
  {
    path: 'frandevplayers2021',
    component: AwardsComponent,
    loadChildren:() => import ('./pages/awards/awards.module').then((m) => m.AwardsModule),
  },
  {
    path: 'monthlycovers',
    component: MonthlyCoversComponent,
    loadChildren: () => import('./pages/monthly-covers/monthly-covers.module').then((m) => m.MonthlyCoversModule),
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about-us/about-us.module').then((m) => m.AboutUsModule),
  },
  {
    path: 'brand',
    loadChildren: () => import('./pages/brand/brand.module').then((m) => m.BrandModule),
  },
  {
    path: '**', // Navigate to Home Page if not found any page
    component: ErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
