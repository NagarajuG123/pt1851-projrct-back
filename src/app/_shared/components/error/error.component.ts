import { Component, OnInit } from '@angular/core';
import { MetaService } from 'src/app/_core/services/meta.service';
import { ApiService } from 'src/app/_core/services/api.service';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import 'lazysizes';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
  faAngleLeft = faAngleLeft;
  s3Url = environment.s3Url;
  constructor(
    private metaService: MetaService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.apiService.getAPI(`1851/meta`).subscribe((response) => {
      this.metaService.setSeo(response.data);
    });
  }
}
