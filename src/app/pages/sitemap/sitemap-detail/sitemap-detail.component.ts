import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Sitemap } from 'src/app/_core/models/sitemap';
import { ApiService } from 'src/app/_core/services/api.service';
import { MetaService } from 'src/app/_core/services/meta.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sitemap-detail',
  templateUrl: './sitemap-detail.component.html',
  styleUrls: ['./sitemap-detail.component.scss']
})
export class SitemapDetailComponent implements OnInit {
  sitemap: Sitemap[] = [];
  year!: any;
  month!: any;
  brandSlug: any = [];
  apiUrl: any;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router:Router,
    private metaService:MetaService
    ) {  this.router.events
      .subscribe(events => {
        if (events instanceof NavigationEnd) {
          this.brandSlug = events.url.split('/')[1];
          if (this.brandSlug === 'sitemap' || this.brandSlug === '' || this.brandSlug.includes('#')) {
            this.brandSlug = '1851';
          } else {
            this.brandSlug = this.brandSlug.replace(/\+/g, '');
          }
        }
      });}

  ngOnInit(): void {
    this.route.paramMap
    .subscribe(params => {
       this.year = params.get('year');
       this.month = params.get('month');
       this.apiService.getAPI(`get-brand-by-slug/${this.brandSlug.replace(/\+/g, '')}`).subscribe((response) => {
        if (response.status != 404 && response.type === 'brand_page') {
          this.brandSlug = response.slug;
          this.apiUrl = `${this.brandSlug}/sitemap-page/${this.year}/${this.month}`;
        }
      });
      this.apiUrl = `sitemap-page/${this.year}/${this.month}`;
      this.getSitemapDetail();
    });
    this.getMeta();
  }

  getSitemapDetail()
  {
    this.apiService.getAPI(`${this.apiUrl}`).subscribe((response) => {
      this.sitemap = response;
      if (response.status === 404) {
        this.router.navigateByUrl('/404');
      }
    });
  }
  getMeta() {
    this.apiService.getAPI(`1851/meta`).subscribe((response) => {
      this.metaService.setSeo(response.data);
      this.apiService.getAPI(`1851/publication-instance`).subscribe((result) => {
        if(this.brandSlug === '1851'){
          this.metaService.setTitle(`Subscribe to | ${result.title} | ${result.newsType}`);
        }
        else{
          this.metaService.setTitle(`Subscribe to | ${this.brandSlug}  ${result.title}  | ${result.newsType}`);
        }  
        });
    });
  }
}
