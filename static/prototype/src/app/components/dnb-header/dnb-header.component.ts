import {Component} from '@angular/core';
import {Observable} from 'rxjs';

const enable_trackPiwik = true;
declare var _paq: any; // Because _pag is declared outside of TypeScript
declare const Piwik: any;

@Component({
  selector: 'dnb-header',
  templateUrl: './dnb-header.component.html',
  styleUrls: ['./dnb-header.component.scss']
    })

export class DnbHeaderComponent {
	private piwikVisitorId: string = '';

  constructor() {
  }

  ngOnInit() {
    console.log(Piwik.getTracker().getVisitorId());
  	if (enable_trackPiwik && typeof _paq !== undefined) {
	    let visitor_id;
	    let that = this;
			_paq.push([ function() {
				visitor_id = this.getVisitorId();
				console.log('Message inside', visitor_id);
				// return visitor_id;
				that.setPiwikID(visitor_id);
			}.bind(that.setPiwikID)]);
			console.log('Message after', visitor_id);
			// visitor_id.subscribe(visitor_id => {
	  //     this.piwikVisitorId = visitor_id;
	  //   });
	  }
  }

  setPiwikID(id) {
  	console.log('you')
  	this.piwikVisitorId = id;
  }

  // _getPiwikID() {
  // 	if (this.piwikVisitorId === '') {
  // 		// this.piwikVisitorId = getPiwikID();
  // 		if (enable_trackPiwik && typeof _paq !== undefined) {
		//     let visitor_id;
		// 		_paq.push([ function() {
		// 			this.piwikVisitorId = this.getVisitorId();
		// 			console.log('Message inside', visitor_id);
		// 			// return this.piwikVisitorId;
		// 		}]);
		// 		console.log('Message after', visitor_id);
		//   }
  // 	}
  // }
}
