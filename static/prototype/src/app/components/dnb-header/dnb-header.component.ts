import {Component, OnInit} from '@angular/core';

import {getPiwikID} from '../../services/piwikTracking';

@Component({
  selector: 'dnb-header',
  templateUrl: './dnb-header.component.html',
  styleUrls: ['./dnb-header.component.scss']
    })

export class DnbHeaderComponent implements OnInit {
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
