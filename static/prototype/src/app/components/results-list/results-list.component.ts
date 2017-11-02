import { Component, ElementRef, Renderer2, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

import { IYear, IItem } from '../../app.interfaces';
import { SelectionService } from '../../services/selection.service';
import { getClassMembers } from '@angular/compiler-cli/src/diagnostics/typescript_symbols';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs/Observable';

import _ from 'lodash';

@Component({
  selector: 'results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss']
})

export class ResultsListComponent implements OnInit {
  private _results: Observable<IYear[]>;
  public years: IYear[] = [];
  public results: IItem[] = [];
  public loadingData = true;
  private fakeData = [{
        name: 'Sven',
        lastname: 'Ellmers (Hg.)',
        title: 'Korporation und Sittlichkeit',
        publisher: 'Wilhelm Fink',
        year: 2017,
        height: 43
      },{
        name: 'Bernd',
        lastname: 'Sommer',
        title: 'Transformationsdesign',
        publisher: 'oekom',
        year: 2016,
        height: 23
      },{
        name: 'Wolfram',
        lastname: 'Pyta)',
        title: 'Bürgerlichkeit',
        publisher: 'Franz Steiner Verlag',
        year: 2015,
        height: 64
      },{
        name: 'Andreas',
        lastname: 'Fisahn',
        title: 'Die Saat des Kadmos',
        publisher: 'Westfälisches Dampfboot',
        year: 2010,
        height: 84
      },{
        name: 'Hans U.',
        lastname: 'Brauner',
        title: 'Ent-Bürgerlichung',
        publisher: 'Allitera Verlag',
        year: 2000,
        height: 35
      },{
        name: 'Sven',
        lastname: 'Ellmers (Hg.)',
        title: 'Korporation und Sittlichkeit',
        publisher: 'Wilhelm Fink',
        year: 1990,
        height: 43
      },{
        name: 'Bernd',
        lastname: 'Sommer',
        title: 'Transformationsdesign',
        publisher: 'oekom',
        year: 1980,
        height: 23
      },{
        name: 'Wolfram',
        lastname: 'Pyta)',
        title: 'Bürgerlichkeit',
        publisher: 'Franz Steiner Verlag',
        year: 1970,
        height: 64
      },{
        name: 'Andreas',
        lastname: 'Fisahn',
        title: 'Die Saat des Kadmos',
        publisher: 'Westfälisches Dampfboot',
        year: 1960,
        height: 84
      },{
        name: 'Hans U.',
        lastname: 'Brauner',
        title: 'Ent-Bürgerlichung',
        publisher: 'Allitera Verlag',
        year: 1950,
        height: 35
      },{
        name: 'Sven',
        lastname: 'Ellmers (Hg.)',
        title: 'Korporation und Sittlichkeit',
        publisher: 'Wilhelm Fink',
        year: 1940,
        height: 43
      },{
        name: 'Bernd',
        lastname: 'Sommer',
        title: 'Transformationsdesign',
        publisher: 'oekom',
        year: 1930,
        height: 23
      },{
        name: 'Wolfram',
        lastname: 'Pyta)',
        title: 'Bürgerlichkeit',
        publisher: 'Franz Steiner Verlag',
        year: 1920,
        height: 64
      },{
        name: 'Andreas',
        lastname: 'Fisahn',
        title: 'Die Saat des Kadmos',
        publisher: 'Westfälisches Dampfboot',
        year: 1910,
        height: 84
      },{
        name: 'Hans U.',
        lastname: 'Brauner',
        title: 'Ent-Bürgerlichung',
        publisher: 'Allitera Verlag',
        year: 1900,
        height: 35
      }];

  constructor(
    private api: ApiService,
    private selection: SelectionService,
    private dataService: DataService) {
      api.loadingData$.subscribe((e) => {
        if (e === 'year') { this.loadingData = true; }
      });
    }

  ngOnInit(): void {
    this._results = this.dataService.years;
    this.dataService.years.subscribe(value => {
      this.loadingData = false;
      this.results = _.chunk(this.fakeData, _.ceil(_.size(this.fakeData) / 5));
    });
  }
}
