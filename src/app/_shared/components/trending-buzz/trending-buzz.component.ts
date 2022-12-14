import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/_core/services/api.service';

@Component({
  selector: 'app-trending-buzz',
  templateUrl: './trending-buzz.component.html',
  styleUrls: ['./trending-buzz.component.scss'],
})
export class TrendingBuzzComponent implements OnInit {
  trending: any = [];
  slug: string = '1851';
  isLoaded: boolean;
  private onDestroySubject = new Subject();
  onDestroy$ = this.onDestroySubject.asObservable();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getTrendingBuzz();
  }

  getTrendingBuzz() {
    this.apiService
      .getAPI(`${this.slug}/trending-buzz?limit=10&offset=0`)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((response) => {
        this.trending = response;
        this.isLoaded = true;
      });
  }

  ngOnDestroy() {
    this.onDestroySubject.next(true);
    this.onDestroySubject.complete();
  }
}
