import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ApiService } from 'src/app/_core/services/api.service';
import { CommonService } from 'src/app/_core/services/common.service';
import { isPlatformBrowser } from '@angular/common';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-spotlight',
  templateUrl: './spotlight.component.html',
  styleUrls: ['./spotlight.component.scss'],
})
export class SpotlightComponent implements OnInit {
  isBrowser!: boolean;
  items: any = [];
  highlightItem: any;
  selectedTab: any;
  scrollbarOptions: any;
  selectedIndex: number = 0;
  tabs: any = [];

  private onDestroySubject = new Subject();
  onDestroy$ = this.onDestroySubject.asObservable();

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
      this.setScrollOption();
      const categoriesApi = this.apiService.getAPI(
        `1851/spotlights/categories`
      );
      forkJoin([categoriesApi])
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((response) => {
          this.selectedTab = response[0].defaultTab;
          const categories = [];
          response[0].categories.forEach((item) => {
            categories.push(item.all);
          });
          this.tabs = categories;

          this.apiService
            .getAPI(
              `1851/spotlight/${this.selectedTab}?limit=11&offset=0`
            )
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result) => {
              if (result.data.length > 0) {
                this.highlightItem = result.data[0];
                this.items = result.data.slice(1, 11);
              }
            });
        });
  }

  setScrollOption() {
    this.scrollbarOptions = {
      axis: 'y',
      theme: 'minimal-dark',
      callbacks: {
        onTotalScroll: () => {
          this.getMoreItem();
        },
      },
    };
  }

  selectTab(tab: any, index: number) {
    this.selectedTab = tab.toLowerCase();
    this.selectedIndex = index;
    this.getData(this.selectedTab, 10, 0);
  }
  selectTabMobile(tab: any, index: number) {
    if (this.selectedIndex === index) {
      this.selectedIndex = -1;
    } else {
      this.selectTab(tab.split(',')[1], index);
    }
  }

  getMoreItem() {
    this.getData(this.selectedTab, 10, this.items.length, false);
  }
  getData(tab: any, limit: number, offset: number, firstLoad: boolean = true) {
    if (firstLoad) {
      this.items = [];
    }
    this.apiService
      .getAPI(`1851/spotlight/${tab}?limit=${limit}&offset=${offset}`)
      .subscribe((result) => {
        if (result.data.length) {
          result['data'].forEach((item: any, index: number) => {
            if (index === 0) {
              if (firstLoad) {
                this.highlightItem = item;
              }
            } else {
              this.items.push(item);
            }
          });
        }
      });
  }
  readMore(item: any) {
    return this.commonService.readMore(item);
  }
  ngOnDestroy() {
    this.onDestroySubject.next(true);
    this.onDestroySubject.complete();
  }
}