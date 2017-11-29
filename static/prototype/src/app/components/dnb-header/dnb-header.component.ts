import {Component} from '@angular/core';
import {Observable} from 'rxjs';

const enable_trackPiwik = true;
declare var _paq: any; // Because _pag is declared outside of TypeScript

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
  	if (enable_trackPiwik && typeof _paq !== undefined) {
	    let visitor_id;
	    let that = this;
			_paq.push([ function() {
				visitor_id = this.getVisitorId();
				that.setPiwikID(visitor_id);
			}]);
	  }
  }

  setPiwikID(id: string): void {
  	this.piwikVisitorId = id;
  }
}
