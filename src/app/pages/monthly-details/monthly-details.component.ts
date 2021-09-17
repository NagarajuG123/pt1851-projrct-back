import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
=======
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/_core/services/api.service';
import { MetaService } from 'src/app/_core/services/meta.service';
import { DatePipe } from '@angular/common';
>>>>>>> cc22ff94e7d3c2908354ce718963aa77624b7aeb

@Component({
  selector: 'app-monthly-details',
  templateUrl: './monthly-details.component.html',
<<<<<<< HEAD
  styleUrls: ['./monthly-details.component.scss']
})
export class MonthlyDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

=======
  styleUrls: ['./monthly-details.component.scss'],
})
export class MonthlyDetailsComponent implements OnInit {
  details: any = [];
  banner: any = [];
  year!: any;
  month!: any;
  date!: any;
  id!: any;
  hasMore: boolean = false;
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private metaService: MetaService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.year = params.get('year');
      this.month = params.get('month');
      this.date = params.get('date');
      this.id = params.get('id');
      const date_number = Number(this.date);
      const coverDate = new Date(`${this.year}-${this.month}-${this.date}`);
      this.apiService
        .getAPI(
          `1851/journal/cover-details/${this.month}/${this.year}/${this.date}/${this.id}?limit=11&offset=0`
        )
        .subscribe((response) => {
          this.banner['data'] = response.data[0];
          this.banner['date'] = this.datePipe.transform(
            coverDate,
            'MMMM dd, YYYY'
          );
          this.details = response.data.slice(1, 11);
          this.hasMore = response.has_more;
          this.apiService.getAPI(`1851/meta`).subscribe((response) => {
            this.metaService.setSeo(response.data);
            this.apiService
              .getAPI(`1851/publication-instance`)
              .subscribe((result) => {
                let title = this.datePipe.transform(coverDate, 'MMMM YYYY');
                this.metaService.setTitle(`${title} Issues | ${result.title}`);
              });
          });
        });
    });
  }
  getMoreData() {
    this.apiService
      .getAPI(
        `1851/journal/cover-details/${this.month}/${this.year}/${this.date}/${
          this.id
        }?limit=10&offset=${this.details.length + 1}`
      )
      .subscribe((result) => {
        this.hasMore = result.has_more;
        result.data.forEach((element: any) => {
          this.details.push(element);
        });
      });
  }
>>>>>>> cc22ff94e7d3c2908354ce718963aa77624b7aeb
}
