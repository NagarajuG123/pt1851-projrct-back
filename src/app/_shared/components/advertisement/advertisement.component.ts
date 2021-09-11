import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from 'src/app/_core/services/api.service';
import { isPlatformBrowser } from '@angular/common';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

const RESULT_KEY = makeStateKey<any>(`adsState`);

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss'],
})
export class AdvertisementComponent implements OnInit {
  adsData: any = [];
  @Input() slug = '1851';
  @Input() type = '';
  @Input() pageType = '';
  slideConfig: any;
  isBrowser: boolean = false;
  private onDestroySubject = new Subject();
  onDestroy$ = this.onDestroySubject.asObservable();
  
  constructor(
    private apiService: ApiService,
    private tstate: TransferState,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.getAds();
    this.slideConfig = {
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 300000,
      dots: false,
      prevArrow: false,
      nextArrow: false,
      draggable: false,
    };
  }

  getAds() {
    if (this.tstate.hasKey(RESULT_KEY)) {
      const adsData = this.tstate.get(RESULT_KEY, {});
      this.adsData = adsData['data'];
    }
    else{
      const adsData = {};
      this.apiService.getAPI(`${this.slug}/ads`).pipe(takeUntil(this.onDestroy$))
      .subscribe((response) => {
        const data = [];
        response.data.forEach((ads: { type: string }) => {
          if (ads.type === this.type) {
            data.push(ads);
          }
        });
        adsData['data'] = data;
      this.tstate.set(RESULT_KEY, adsData);
     });  
    }
  }
}
