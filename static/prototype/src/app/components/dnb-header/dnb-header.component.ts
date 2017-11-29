import {Component} from '@angular/core';

import {getPiwikID} from '../../services/piwikTracking';

@Component({
  selector: 'dnb-header',
  templateUrl: './dnb-header.component.html',
  styleUrls: ['./dnb-header.component.scss']
    })

export class DnbHeaderComponent {
  public piwikVisitorId = '';

  constructor() {
  }

  ngOnInit(): void {
    getPiwikID(this.setPiwikID.bind(this));
  }

  setPiwikID(id: string): void {
    this.piwikVisitorId = id;
  }
}
