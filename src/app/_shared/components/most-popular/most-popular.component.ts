import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ApiService } from 'src/app/_core/services/api.service';
import { Details } from 'src/app/_core/models/details.model';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/_core/services/common.service';
import 'lazysizes';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

const RESULT_KEY = makeStateKey<any>('mostPopularState');

@Component({
  selector: 'app-most-popular',
  templateUrl: './most-popular.component.html',
  styleUrls: ['./most-popular.component.scss'],
})
export class MostPopularComponent implements OnInit {
  @Input() type: string;
  @Input() slug: string;

  isBrowser!: boolean;
  data: Details[] = [];
  customOptions: OwlOptions = {};
  faAngleRight = faAngleRight;
  isLoaded: boolean = false;
  private onDestroySubject = new Subject();
  onDestroy$ = this.onDestroySubject.asObservable();
  public innerWidth: any;
  products: any;
  products2: any;
  products3: any;
  options1: any;
  options2: any;
  options3: any;

  constructor(
    private apiService: ApiService,
    private tstate: TransferState,
    @Inject(PLATFORM_ID) private platformId: object,
    public commonService: CommonService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.options2 = {
      animation: {
        animationClass: 'transition', // done
        animationTime: 500,
      },
      swipe: {
        swipeable: true, // done
        swipeVelocity: 0.004, // done - check amount
      },
      drag: {
        draggable: true, // done
        dragMany: true, // todo
      },
      autoplay: {
        enabled: true,
        direction: 'right',
        delay: 5000,
        stopOnHover: true,
        speed: 6000,
      },
      arrows: true,
      infinite: false,
      breakpoints: [
        {
          width: 768,
          number: 1,
        },
        {
          width: 991,
          number: 3,
        },
        {
          width: 9999,
          number: 3,
        },
      ],
    };
    this.products2 = [];
    this.products2.push({
      title: 'Black Widgets',
      url: 'https://url',
      regularPrice: '100.00',
      image: `https://picsum.photos/600/400/?5`,
    });
    this.products2.push({
      title: 'Black Widgets',
      url: 'https://url',
      regularPrice: '100.00',
      image: `https://picsum.photos/600/400/?6`,
    });
    this.products2.push({
      title: 'Black Widgets',
      url: 'https://url',
      regularPrice: '100.00',
      image: `https://picsum.photos/600/400/?7`,
    });
    this.products2.push({
      title: 'Black Widgets',
      url: 'https://url',
      regularPrice: '100.00',
      image: `https://picsum.photos/600/400/?6`,
    });
    this.products2.push({
      title: 'Black Widgets',
      url: 'https://url',
      regularPrice: '100.00',
      image: `https://picsum.photos/600/400/?7`,
    });
    this.products2.push({
      title: 'Black Widgets',
      url: 'https://url',
      regularPrice: '100.00',
      image: `https://picsum.photos/600/400/?8`,
    });
    this.products2.push({
      title: 'Black Widgets',
      url: 'https://url',
      regularPrice: '100.00',
      image: `https://picsum.photos/600/400/?8`,
    });
    this.products2.push({
      title: 'Black Widgets',
      url: 'https://url',
      regularPrice: '100.00',
      image: `https://picsum.photos/600/400/?8`,
    });
  }

  ngOnInit(): void {
    this.setOption();
    this.getMostPopular();
  }

  getMostPopular() {
    this.apiService
      .getAPI(`${this.slug}/trending?limit=9&offset=0`)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((response) => {
        if (response.data.length) {
          this.data = response.data;
          this.isLoaded = true;
        }
      });
  }
  setOption() {
    this.customOptions = {
      autoplay: false,
      loop: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: false,
      dots: false,
      navSpeed: 700,
      navText: [
        '<img src="assets/img/left-arrow.svg" alt="slider arrow" width="15px" height="30px"/>',
        '<img src="assets/img/right-arrow.svg" alt="slider arrow" width="15px" height="30px"/>',
      ],
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
  }
}
