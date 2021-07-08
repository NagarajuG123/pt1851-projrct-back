import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_core/services/api.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
   footer: any =[];
   publication: any =[];
  brandSlug = '1851';
  isFooter: boolean = true;
  isBrandFooter: boolean = false;
  brandContact: any;
  constructor( private apiService: ApiService,private router:Router ) { }

  ngOnInit(): void {
    this.getPublication();
    this.router.events
    .subscribe(events => {
      if (events instanceof NavigationEnd) {
        this.brandSlug = events.url.split('/')[1];
        if (this.brandSlug === '' || this.brandSlug.includes('#')) {
          this.brandSlug = '1851';
        } else {
          if (this.brandSlug === 'robots.txt') {
            this.isFooter = false;
          } else {
            this.brandSlug = this.brandSlug.replace(/\+/g, '');
            this.apiService.getAPI(`get-brand-by-slug/${this.brandSlug}`).subscribe((response) => {
              if (response.type === 'brand_page') {
                this.brandSlug = response.slug;
                this.isBrandFooter = true;
              }
            });
            this.getContact();
          }
        }
        this.apiService.getAPI(`${this.brandSlug}/footer`).subscribe((response) => {
          this.footer = response.data;
        });
      }
    }); 
  }

  getPublication(){
    this.apiService.getAPI(`1851/publication-instance`).subscribe((response ) =>{
      this.publication = response;
    });
  }
  getContact() {
    this.apiService.getAPI(`${this.brandSlug}/brand/contact`).subscribe((response ) =>{
      this.brandContact = response.schema;
    });
  }
}
