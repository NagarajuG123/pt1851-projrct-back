import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public showmenu: boolean = false;
  public vtabsItem: number = 5;
  public brandInfoTabs: number = 5;

  isBrowser: boolean = false;
  isPageLoaded = new BehaviorSubject<boolean>(false);
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.resizeSidebar(window.innerWidth);
      this.resizeBrandInfo(window.innerWidth);
    }
  }

  toggle() {
    this.showmenu = !this.showmenu;
    window.scrollTo(0, 0);
    if (this.showmenu) {
      $('.sidebar-dropdown-menu').addClass('show');
      $('.sidebar-blur').addClass('show');
      $('body').addClass('noscroll');
    } else {
      $('.sidebar-dropdown-menu').removeClass('show');
      $('.sidebar-blur').removeClass('show');
      $('body').removeClass('noscroll');
    }
  }

  readMore(story: any) {
    let slug = '';
    if (typeof story?.brand !== 'undefined' && story?.brand?.slug !== '1851') {
      slug = `${story?.brand?.slug}/`;
    }
    return `${slug}${story?.slug}`;
  }
  isVideo(item: { media: { type: string } | null } | null) {
    if (typeof item !== 'undefined' && item !== null) {
      if (typeof item.media !== 'undefined' && item.media !== null) {
        if (item.media.type === 'video') {
          return true;
        }
      }
    }
    return false;
  }
  resizeSidebar(val: any) {
    if (val > 992) this.vtabsItem = 5;
    else if (val < 993 && val > 767) this.vtabsItem = 3;
    else if (val < 768 && val > 575) this.vtabsItem = 2;
    else if (val < 576) this.vtabsItem = 1;
    else this.vtabsItem = 5;
  }
  resizeBrandInfo(val: any) {
    if (val > 992) this.brandInfoTabs = 6;
    else if (val < 993 && val > 767) this.brandInfoTabs = 3;
    else if (val < 768 && val > 575) this.brandInfoTabs = 2;
    else if (val < 576) this.brandInfoTabs = 1;
    else this.brandInfoTabs = 6;
  }

  authorName(item: any) {
    if (item?.author != null) {
      return true;
    }
    return false;
  }

  isDate(story:any) {
    if ( new Date(story?.posted_on) || new Date(story?.last_modified) ) {
      return true;
    }
    return false;
  }

  isUpdate(story:any) {
    let post = new Date(story?.posted_on).toDateString();
    let last = new Date(story?.last_modified).toDateString();
    if (post !== last) {
      return true;
    }
    return false;
  }
}
