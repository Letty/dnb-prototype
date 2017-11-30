import {Component, OnInit} from '@angular/core';

import {getPiwikID} from '../../services/piwikTracking';
import {RouterService} from '../../services/router.service';

@Component({
  selector: 'dnb-header',
  templateUrl: './dnb-header.component.html',
  styleUrls: ['./dnb-header.component.scss']
    })

export class DnbHeaderComponent implements OnInit {
  public piwikVisitorId = '';

  constructor(
    private router: RouterService
  ) {}

  ngOnInit(): void {
    getPiwikID(this.setPiwikID.bind(this));
  }

  setPiwikID(id: string): void {
    this.piwikVisitorId = id;
  }

  toggleInformation() {
    this.router.toggleInfo();
  }
}
