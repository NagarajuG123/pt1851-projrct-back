import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_core/services/api.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  header: any =[];
  isBrand: Boolean = false;

  constructor(private apiService:ApiService) {}

  ngOnInit(): void {
    this.getHeader();
  }

  getHeader() {
    this.apiService.getHeader().subscribe((response) => {
      this.header = response;
    });
  }
   openMenu() {
    $('body').toggleClass('menu-open');
  }

}