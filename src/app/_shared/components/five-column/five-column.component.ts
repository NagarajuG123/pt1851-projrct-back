import { Component, OnInit, Input } from '@angular/core';
import { FiveColumn } from 'src/app/_core/models/fiveColumn';

@Component({
  selector: 'app-five-column',
  templateUrl: './five-column.component.html',
  styleUrls: ['./five-column.component.scss']
})
export class FiveColumnComponent implements OnInit {
  @Input() contents: FiveColumn[] = [];
  @Input() slug: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
