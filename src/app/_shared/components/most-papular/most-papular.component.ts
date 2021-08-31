import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ApiService } from 'src/app/_core/services/api.service';
import { Details } from 'src/app/_core/models/details.model';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const RESULT_KEY = makeStateKey<any>('mostPopularState');

@Component({
  selector: 'app-most-papular',
  templateUrl: './most-papular.component.html',
  styleUrls: ['./most-papular.component.scss'],
})
export class MostPapularComponent implements OnInit {

  isBrowser!: boolean;
  data: Details[] = [];
  slug: string = '1851';
  private onDestroySubject = new Subject();
  onDestroy$ = this.onDestroySubject.asObservable();

  constructor(private apiService: ApiService,
    private tstate: TransferState,
    @Inject(PLATFORM_ID) private platformId: object,) {
      this.isBrowser = isPlatformBrowser(platformId);
    }

  customOptions: OwlOptions = {
    autoplay: true,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: true,
  };
  

  ngOnInit(): void {
    this.slug = '1851';
    this.getmostPopular();
  }

  getmostPopular(){
     if(this.tstate.hasKey(RESULT_KEY)){
       const mostPopular = this.tstate.get(RESULT_KEY,{});
       this.data = mostPopular['data'];
     }
     else{
       const mostPopular:any = {};
       this.apiService
        .getAPI(`${this.slug}/trending?limit=9&offset=0`)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((response) => { 
          mostPopular['data'] = response.data;
        });
        this.tstate.set(RESULT_KEY, mostPopular);
     }
  }
}
