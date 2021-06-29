import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_core/services/api.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  bannerImageLoaded: Boolean = false;
  data: any = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.apiService.getAPI(`1851/about-us`).subscribe((response ) =>{
      this.data = response.data;
    });
  }
  bannerImageLoad() {
    this.bannerImageLoaded = true;
  }
}
