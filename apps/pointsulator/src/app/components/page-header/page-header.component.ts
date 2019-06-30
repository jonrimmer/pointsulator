import {
  Component,
  OnInit,
  HostBinding,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'pt-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageHeaderComponent implements OnInit {
  @HostBinding('class.mat-elevation-z1')
  elevation = true;

  constructor() {}

  ngOnInit() {}
}
