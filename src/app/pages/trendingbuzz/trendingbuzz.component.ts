import { Component,  Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Details } from 'src/app/_core/models/details.model';
import { ApiService } from 'src/app/_core/services/api.service';
import { MetaService } from 'src/app/_core/services/meta.service';
import { CommonService } from 'src/app/_core/services/common.service';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-trendingbuzz',
  templateUrl: './trendingbuzz.component.html',
  styleUrls: ['./trendingbuzz.component.scss'],
})
export class TrendingbuzzComponent implements OnInit {
  trendingData: Details[] = [];
  banner: any = [];
  isBrowser: boolean;
  slug: string = '1851';
  hasMore: boolean = false;
  isLoaded: boolean;
  s3Url = environment.s3Url;
  openVideoPlayer: boolean;
  videoUrl: string;
  constructor(
    private apiService: ApiService,
    private metaService: MetaService,
    public commonService: CommonService,
    @Inject(PLATFORM_ID) platformId: Object
    ) {
      this.isBrowser = isPlatformBrowser(platformId);
    }

  ngOnInit(): void {
    this.getTrending();
  }

  getTrending() {
    this.apiService
      .getAPI(`${this.slug}/trending-buzz?limit=11&offset=0`)
      .subscribe((response) => {
        this.metaService.setSeo(response.data[0].meta);
        this.trendingData = response.data.slice(1);
        this.banner = response.data[0];
        if (this.isVideo(this.banner)) {
          this.videoUrl = this.banner.media.url;
        }
        this.hasMore = response.has_more;
        this.isLoaded = true;
        this.metaService.setTitle(`Trending Brand Buzz | ${this.commonService.publication.title}`);
      });
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
  getMoreData() {
    this.apiService
      .getAPI(
        `${this.slug}/trending-buzz?limit=5&offset=${
          this.trendingData.length + 1
        }`
      )
      .subscribe((result) => {
        this.hasMore = result.has_more;
        result.data.forEach((element: any) => {
          this.trendingData.push(element);
        });
      });
  }
  ngAfterViewInit(){
    if(this.isBrowser)
    {
      $('.modal').on('hidden.bs.modal', function(){
        $('.modal').hide();
        $('.modal iframe').attr("src", jQuery(".modal iframe").attr("src"));
        const modalVideo = $(this).html();
        $(this).html(modalVideo);
      });
    }
  }
}
