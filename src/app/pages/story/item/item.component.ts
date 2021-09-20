import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
  SimpleChange,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';
import { ApiService } from 'src/app/_core/services/api.service';
import { CommonService } from 'src/app/_core/services/common.service';
import { environment } from 'src/environments/environment';
declare var ga: Function;

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  @Input() details: any;
  @Input() news: any;
  @Input() brandSlug = '1851';
  @Input() index: string;
  @Input() type: string;
  @Input() isLoading: boolean;
  @Input() socialImage: string;
  @Input() isSmallWindow: boolean;
  @Input() publication: any;
  @Input() newsTitle: string;

  @ViewChild('virtualScroll') virtualScroll: ElementRef;

  public isBrowser = false;
  public isServer: boolean;

  id: string;
  title: string;
  short_description: string;
  content: string;
  category: string;
  author_name: string;
  date_time: Date;
  last_modified: Date;
  media: any;
  brandNews: any;
  newsShow = false;
  designation: any;
  author_media: any;
  url: string;
  shareDescription: string;
  shareHashtags: string;
  shareVia: string;
  scrollbarOptions: any;
  openVideoPlayer = false;
  sponsorship = false;
  sponsorship_position: string;
  isViewComment: boolean;
  facebookHTML = '';
  full_url;
  slideConfig: any;
  isBrand: boolean;
  adsImages: Array<object> = [];
  fb_url: string;
  default_fb_url: string;
  isDefault_fb = false;
  brand_id: string;
  isMaxresultImg: Boolean = true;
  sponsorContent = false;
  storyContent: any;

  private onDestroySubject = new Subject();
  onDestroy$ = this.onDestroySubject.asObservable();
  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private _googleAnalyticsService: GoogleAnalyticsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isServer = isPlatformServer(platformId);
    this.isBrowser = isPlatformBrowser(platformId);
    this.newsTitle = '';
  }

  ngOnInit(): void {
    this.storyContent = this.details.content;
    this.apiService
      .getAPI(`terms`)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (typeof result !== 'undefined') {
          if (typeof result.data !== 'undefined' && result.data !== null) {
            result.data.forEach((brand) => {
              if (brand !== '' && brand !== null) {
                let brandRegex = new RegExp(brand);
                if (brandRegex.test(this.storyContent)) {
                  this.sponsorContent = true;
                }
              }
            });
          }
        }
      });

    this.shareHashtags = '1851, Social';
    this.isViewComment = false;
    this.isBrand = this.brandSlug === '1851' ? false : true;
    this.apiService
      .getAPI(`${this.brandSlug}/ads`)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((a_result) => {
        a_result['data'].forEach((ad) => {
          if (ad.type === 'Story Ad') {
            this.adsImages.push(ad);
          }
        });
      });
    // tslint:disable-next-line:max-line-length
    this.default_fb_url = `https://www.facebook.com/plugins/page.php?href=${environment.fbUrl}&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`;
    if (this.details.brand) {
      if (
        typeof this.details.brand.fb_page_url === 'undefined' ||
        this.details.brand.fb_page_url === null
      ) {
        this.fb_url = environment.fbUrl;
      } else {
        // tslint:disable-next-line:max-line-length
        this.fb_url = this.details.brand.fb_page_url;
      }
    } else {
      this.fb_url = environment.fbUrl;
    }
  }
  readMore(item: any) {
    return this.commonService.readMore(item);
  }
  ngOnChanges(changes: SimpleChanges) {
    const details: SimpleChange = changes.details;
    const news: SimpleChange = changes.news;
    if (
      typeof details !== 'undefined' &&
      typeof details.currentValue !== 'undefined'
    ) {
      this.id = details.currentValue.id;
      this.title = details.currentValue.title;
      this.shareDescription = details.currentValue.title;
      this.short_description = details.currentValue.short_description;
      this.content = details.currentValue.content;
      this.category = details.currentValue.category;
      this.author_name = details.currentValue.author
        ? details.currentValue.author.name
        : '';
      this.designation = details.currentValue.author
        ? details.currentValue.author.designation
        : '';
      this.author_media = details.currentValue.author
        ? details.currentValue.author.media
        : '';
      this.date_time = new Date(
        details.currentValue.posted_on.replace(/-/g, '/')
      );
      this.last_modified = new Date(
        details.currentValue.last_modified.replace(/-/g, '/')
      );
      this.media = details.currentValue.media;
      this.sponsorship = details.currentValue.sponsorship.is_sponsored;
      this.sponsorship_position = details.currentValue.sponsorship.position;
      if (typeof this.media !== 'undefined') {
        if (
          typeof this.media.type !== 'undefined' &&
          this.media.type === 'video'
        ) {
          this.url = this.media.url;
        } else {
          this.url = '';
        }
      } else {
        this.url = '';
      }
      if (this.isBrowser) {
        if (this.brandSlug !== '1851') {
          this.full_url = `${window.location.origin}/${this.brandSlug}`;
        } else {
          this.full_url = `${window.location.origin}/${this.details.slug}`;
        }
      }
    }
    if (
      typeof news !== 'undefined' &&
      typeof news.currentValue !== 'undefined'
    ) {
      this.brandNews = news.currentValue;
      this.newsShow = true;
    }
  }
  ngAfterViewInit() {
    if (this.isBrowser) {
      $('.tooltiptext').click(function (e) {
        e.preventDefault();
      });
      $('.tooltiptext-link').click(function (e) {
        e.preventDefault();
        window.location.href = '/home/termsofuse#sponsored';
      });
      window['__sharethis__'].load('inline-share-buttons', {
        alignment: 'left',
        id: `inline-buttons-${this.index}`,
        enabled: true,
        font_size: 15,
        padding: 8,
        radius: 0,
        networks: ['facebook', 'twitter', 'linkedin'],
        size: 50,
        url: this.shareUrl(),
        title: this.title,
        image: this.socialImage,
        description: this.shareDescription,
      });
      const fb_timer = setInterval(() => {
        if (!$(`#mobile_block_fb_link${this.id}`).length) {
          clearInterval(fb_timer);
          setTimeout(() => {
            if ($(`#mobile_fb_plugin${this.id}`).height() < 100) {
              this.isDefault_fb = true;
            }
          }, 10000);
        }
      }, 1000);

      // streams
      const click$ = fromEvent(
        $(`#inline-buttons-${this.index} .st-btn`),
        'click'
      );
      click$
        .pipe(
          map((i: any) => i.currentTarget),
          debounceTime(1000),
          takeUntil(this.onDestroy$)
        )
        .subscribe((val) => {
          const data = $(val).data();
          this.apiService
            .getAPI(`get-brand-by-slug/${this.brandSlug}`)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result) => {
              if (typeof result.id !== 'undefined' && result.id !== null) {
                const brand_name = result.slug;
                const gaData = result['ga'];
                if (result.id !== '1851' && this.isBrowser) {
                  if (gaData) {
                    ga(`${brand_name}.send`, {
                      hitType: 'social',
                      socialNetwork: `ShareThis_${data.network}`,
                      socialAction: 'share',
                      socialTarget: this.shareUrl(),
                    });
                  }
                }
              } else {
                ga(`send`, {
                  hitType: 'social',
                  socialNetwork: `ShareThis_${data.network}`,
                  socialAction: 'share',
                  socialTarget: this.shareUrl(),
                });
              }
            });
        });
      this.apiService
        .getAPI(`get-brand-by-slug/${this.brandSlug}`)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          if (typeof result.id !== 'undefined' && result.id !== null) {
            this.brand_id = result.id;
          } else {
            this.brand_id = '1851';
          }
          const a_tags = document
            .getElementById(this.id)
            .getElementsByTagName('A');
          const category = `${this.id}+${this.brand_id}+${this.type}`;
          const vm = this;
          const gaData = result['ga'];
          for (let i = 0; i < a_tags.length; i++) {
            if (
              a_tags[i]['hostname'].toLowerCase() !==
              window.location.hostname.toLowerCase()
            ) {
              a_tags[i].addEventListener('click', function (event) {
                const action = a_tags[i]['hostname'].toLowerCase();
                if (this.brand_id === '1851') {
                  ga('send', 'event', category, action, vm.brand_id);
                } else {
                  if (gaData) {
                    ga(
                      `${vm.brandSlug}.send`,
                      'event',
                      category,
                      action,
                      vm.brand_id
                    );
                  }
                }
              });
            }
          }
        });
    }
  }

  goAuthorPage() {
    if (this.details.author) {
      return `author/${this.details.author.slug}`;
    } else {
      return '#';
    }
  }

  getTrustUrl() {
    return ``;
  }

  shareUrl() {
    const subUrl =
      this.brandSlug !== '1851'
        ? `${this.brandSlug}/${this.details.slug}`
        : `${this.details.slug}`;
    return `${window.location.origin}/${subUrl}`;
  }

  getMoreItem() {
    if (this.brandSlug === '1851') {
      this.apiService
        .getAPI(
          `${this.brandSlug}/news?lean=true&limit=10&offset=${this.brandNews.length}`
        )
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          result['data'].forEach((news, index) => {
            this.brandNews.push(news);
          });
        });
    } else {
      this.apiService
        .getAPI(
          `${this.brandSlug}/brand-latest-stories?limit=10&offset=${this.brandNews.length}`
        )
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          result.data.forEach((item) => {
            this.brandNews.push(item);
          });
        });
    }
  }

  goBrandNews(news) {
    let slug = '';
    if (typeof news.brand !== 'undefined' && news.brand.id !== '1851') {
      slug = `${news.brand.slug}/`;
    }
    return `${slug}${news.slug}#${this.type}`;
  }
  isDate() {
    if (this.date_time || this.last_modified) {
      return true;
    }
    return false;
  }

  isUpdate() {
    let postDate = this.date_time.toDateString();
    let lastDate = this.last_modified.toDateString();
    if (postDate === lastDate) {
      return false;
    }
    return true;
  }

  openFbComment() {
    this.isViewComment = !this.isViewComment;
    window['FB'].init({
      appId: '346418588772225',
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v3.3',
    });
  }

  // setSponsorContent() {
  //   this.apiService.getAPI(`terms`).subscribe((result) => {
  //     if (typeof result !== 'undefined' && result.data !== null) {
  //       result.data.forEach((brand: string) => {
  //         if (brand !== '' && brand !== null) {
  //           let brandRegex = new RegExp(brand);
  //           if (brandRegex.test(this.details.content)) {
  //             this.sponsorContent = true;
  //             // this.publishDate = new Date(this.details.posted_on.replace(/-/g, '/'));
  //           }
  //         }
  //       });
  //     }
  //   });
  // }
  isVideo(item: any) {
    return this.commonService.isVideo(item);
  }
  ngOnDestroy() {
    this.onDestroySubject.next(true);
    this.onDestroySubject.complete();
  }
}