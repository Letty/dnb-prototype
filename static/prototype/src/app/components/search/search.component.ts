import {Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, SecurityContext} from '@angular/core';
import {ApiService} from '../../services/api.service';

import {IPerson, ITopic} from '../../app.interfaces';
import {DataService} from '../../services/data.service';
import {SelectionService} from '../../services/selection.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit, AfterViewInit {
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() term: string = null;
  @ViewChild('input') input;

  public selectedMinYear: number;
  public selectedMaxYear: number;
  public selectedPerson: IPerson;
  public selectedTopic: ITopic;
  public highlight = 0;
  public years: any = [];
  public topics: any = [];
  public persons: any = [];
  public showSuggestions = false;

  constructor(
    private api: ApiService,
    private selection: SelectionService,
    private dataService: DataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.selection.selPerson$.subscribe(person => this.selectedPerson = person);
    this.selection.selTopic$.subscribe(topic => this.selectedTopic = topic);
    this.selection.selMinYear$.subscribe(year => this.selectedMinYear = year);
    this.selection.selMaxYear$.subscribe(year => this.selectedMaxYear = year);
  }

  ngAfterViewInit() {
    this.input.update
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(term => {
        term = term.trim();
        if (term.length >= 3) {
          this.api.searchForTopic(term).subscribe(data => {
            this.topics = data.map(d => {
              return {
                id: d.id,
                formatted: this.format(d.keyword),
                keyword: d.keyword
              };
            });
            if (this.years.length + this.topics.length + this.persons.length <= this.highlight) this.highlight = 0;
          });
          this.api.searchForPerson(term).subscribe(data => {
            this.persons = data.map(d => {
              return {
                id: d.id,
                formatted: this.format(`${d.name} ${d.lastname}`),
                name: d.name,
                lastname: d.lastname
              };
            });
            if (this.years.length + this.topics.length + this.persons.length <= this.highlight) this.highlight = 0;
          });
        } else {
          this.persons = this.topics = [];
        }

        const start = term.match(/^(\d{4})(?:[^0-9]|$)/) ? +term.match(/^(\d{4})(?:[^0-9]|$)/)[1] : null;
        const end = term.match(/[^0-9](\d{4})$/) ? +term.match(/[^0-9](\d{4})$/)[1] : null;
        const today = 2018;

        const years = [];
        if (start && !end && start >= 1000 && start <= today) {
          years.push([start, start]);
          if (start % 10 === 0 && start + 10 <= today) years.push([start, start + 9]);
          if (start % 100 === 0 && start + 100 <= today) years.push([start, start + 99]);
          if (start < today) years.push([start, today]);
        } else if (start && end && start <= end && start >= 1000 && end <= today) {
          years.push([start, end]);
        }

        this.years = years.map(y => {
          return {
            formatted: this.format(y[0] === y[1] ? `${y[0]}` : `${y[0]}—${y[1]}`),
            start: y[0],
            end: y[1]
          };
        });
        if (this.years.length + this.topics.length + this.persons.length <= this.highlight) this.highlight = 0;
      });
  }

  format (value: string) {
    return this.sanitizer.sanitize(SecurityContext.HTML,
      value.replace(new RegExp(this.term, 'gi'), inner => `<b>${inner}</b>`));
  }

  selectYear(year) {
    this.selection.setYear(year.start, year.end);
    this.dataService.setFilter();
    this.showSuggestions = false;
    this.reset();
  }

  selectTopic(topic) {
    this.selection.setTopic(topic);
    this.dataService.setFilter();
    this.showSuggestions = false;
    this.reset();
  }

  selectPerson(person) {
    this.selection.setPerson(person);
    this.dataService.setFilter();
    this.showSuggestions = false;
    this.reset();
  }

  reset () {
    this.term = null;
    this.years = [];
    this.topics = [];
    this.persons = [];
  }

  keydown (e) {
    if (e.keyCode === 13) {
      if (this.highlight < this.years.length) {
        this.selectYear(this.years[this.highlight]);
      } else if (this.highlight < this.topics.length + this.years.length) {
        this.selectTopic(this.topics[this.highlight - this.years.length]);
      } else if (this.highlight < this.persons.length + this.topics.length + this.years.length) {
        this.selectPerson(this.persons[this.highlight - this.topics.length - this.years.length]);
      }
     }
     const results = this.years.length + this.topics.length + this.persons.length;
     if (e.keyCode === 40) this.highlight = (this.highlight + 1) % results;
     if (e.keyCode === 38) this.highlight = (this.highlight + results - 1) % results;
  }

  resetYear(): void {
    this.selection.setYear(null, null);
    this.dataService.setFilter();
  }

  resetTopic(): void {
    this.selection.setTopic(null);
    this.dataService.setFilter();
  }

  resetPerson(): void {
    this.selection.setPerson(null);
    this.dataService.setFilter();
  }

  highlightSuggestion (i) {
    this.highlight = i;
  }
}
