import {Injectable, EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {ApiService} from '../services/api.service';
import {SelectionService} from './selection.service';
import {IPerson, ITopic, IYear, IItem, INetworkLink} from '../app.interfaces';
import {Observable} from 'rxjs/Observable';

import {trackPiwik} from './piwikTracking';

@Injectable()
export class DataService {
  public loadingData$: EventEmitter<string>;

  topics: Observable<ITopic[]>;
  persons: Observable<IPerson[]>;
  years: Observable<IYear[]>;
  items: Observable<IItem[]>;
  networkLinks: Observable<INetworkLink[]>;
  personYears: Observable<IYear[][]>;

  private _topics: BehaviorSubject<ITopic[]>;
  private _persons: BehaviorSubject<IPerson[]>;
  private _years: BehaviorSubject<IYear[]>;
  private _items: BehaviorSubject<IItem[]>;
  private _networkLinks: BehaviorSubject<INetworkLink[]>;
  private _personYears: BehaviorSubject<IYear[][]>;

  private load: any = {};

  private year: Array<IYear>;

  private page = 0;

  private dataStore: {
    persons: IPerson[],
    defaultPersons: IPerson[],

    topics: ITopic[],
    defaultTopics: ITopic[],

    years: IYear[],
    defaultYears: IYear[],

    items: IItem[],
    defaultItems: IItem[]

    networkLinks: INetworkLink[],
    defaultNetworkLinks: INetworkLink[],
    networkLinksAvailable: boolean,
    networkLinksRequired: boolean

    personYears: IYear[][],
    defaultPersonYears: IYear[][]
  };

  constructor(
    private api: ApiService,
    private selection: SelectionService
  ) {
    this.dataStore = {
      persons: [], defaultPersons: [],
      topics: [], defaultTopics: [],
      years: [], defaultYears: [],
      items: [], defaultItems: [],
      networkLinks: [], defaultNetworkLinks: [], networkLinksAvailable: false, networkLinksRequired: false,
      personYears: [], defaultPersonYears: []
    };

    this._topics = <BehaviorSubject<ITopic[]>>new BehaviorSubject([]);
    this._persons = <BehaviorSubject<IPerson[]>>new BehaviorSubject([]);
    this._years = <BehaviorSubject<IYear[]>>new BehaviorSubject([]);
    this._items = <BehaviorSubject<IItem[]>>new BehaviorSubject([]);
    this._networkLinks = <BehaviorSubject<INetworkLink[]>>new BehaviorSubject([]);
    this._personYears = <BehaviorSubject<IYear[][]>>new BehaviorSubject([]);

    this.topics = this._topics.asObservable();
    this.persons = this._persons.asObservable();
    this.years = this._years.asObservable();
    this.items = this._items.asObservable();
    this.networkLinks = this._networkLinks.asObservable();
    this.personYears = this._personYears.asObservable();

    this.loadingData$ = new EventEmitter();

    this.api.getYears()
      .subscribe(data => {
        this.dataStore.years = data;
        this.dataStore.defaultYears = data;
        this._years.next(Object.assign({}, this.dataStore).years);
      }, err => console.log('error while loading default year'));

    this.api.getPersons()
      .subscribe(data => {
        this.dataStore.persons = data;
        this.dataStore.defaultPersons = data;
        this._persons.next(Object.assign({}, this.dataStore).persons);

        this.api.getYearsForMultiplePersons(data.map(d => d.id))
          .subscribe(years => {
            this.dataStore.personYears = years;
            this.dataStore.defaultPersonYears = years;
            this._personYears.next(Object.assign({}, this.dataStore).personYears);
          }, err => console.log('error while loading default personYears'));
      }, err => console.log('error while loading default persons'));

    this.api.getTopics()
      .subscribe(data => {
        this.dataStore.topics = data;
        this.dataStore.defaultTopics = data;
        this._topics.next(Object.assign({}, this.dataStore).topics);
      }, err => console.log('error while loading default topics'));

    this.api.getResults()
      .subscribe(data => {
        this.dataStore.items = data;
        this.dataStore.defaultItems = data;
        this._items.next(Object.assign({}, this.dataStore).items);
      }, err => console.log('error while loading start results'));

    this.api.getTopTopicConnections()
      .subscribe(data => {
        this.dataStore.networkLinks = data;
        this.dataStore.defaultNetworkLinks = data;
        this._networkLinks.next(Object.assign({}, this.dataStore).networkLinks);
      }, err => console.log('error while loading default networkLinks'));
  }

  setYear(years_: IYear[]): void {
    this.dataStore.years = years_;
    this._years.next(Object.assign({}, this.dataStore).years);
  }

  setTopic(topics_: ITopic[]): void {
    this.dataStore.topics = topics_;
    this._topics.next(Object.assign({}, this.dataStore).topics);
  }

  setPerson(persons_: IPerson[]): void {
    this.dataStore.persons = persons_;
    this._persons.next(Object.assign({}, this.dataStore).persons);
  }

  setItems(items_: IItem[]): void {
    this.dataStore.items = items_;
    this._items.next(Object.assign({}, this.dataStore).items);
  }

  setNetworkLinks(networkLinks_: INetworkLink[]): void {
    this.dataStore.networkLinks = networkLinks_;
    this._networkLinks.next(Object.assign({}, this.dataStore).networkLinks);
  }

  setPersonYears(years_: IYear[][]): void {
    this.dataStore.personYears = years_;
    this._personYears.next(Object.assign({}, this.dataStore).personYears);
  }

  setFilter(): void {
    this.page = 0;
    this.dataStore.networkLinksAvailable = false;
    this.filterData();
  }

  setRoute(route): void {
    let piwikDescription;
    switch (route) {
      case 'index':
        this.dataStore.networkLinksRequired = false;
        piwikDescription = 'StartView';
        break;
      case 'topic':
        this.dataStore.networkLinksRequired = true;
        piwikDescription = 'TopicDetailView';
        break;
      case 'person':
        this.dataStore.networkLinksRequired = false;
        piwikDescription = 'PersonDetailView';
        break;
      case 'results':
        this.dataStore.networkLinksRequired = false;
        piwikDescription = 'PersonResultView';
        break;
    }
    trackPiwik('setRoute', piwikDescription);
    if (this.dataStore.networkLinksRequired) this.filterData();
  }

  getFilter (): any {
    const {person_id, topic_id, min_year, max_year} = this.selection.getSelection() as any;
    return {
      person_id: String(person_id),
      topic_id: String(topic_id),
      min_year,
      max_year,
      hasPerson: person_id !== null,
      hasTopic: topic_id !== null,
      hasYear: min_year !== null && max_year !== null
    };
  }

  filterData(): void {
    const {person_id, topic_id, min_year, max_year, hasPerson, hasTopic, hasYear} = this.getFilter();
    const {networkLinksAvailable, networkLinksRequired} = this.dataStore;

    this.load = {
      network: !networkLinksAvailable && networkLinksRequired
    };

    this.loadingData$.emit('data');
    if (this.load.network) this.loadingData$.emit('links');

    if (!hasPerson && !hasTopic && hasYear) {
      this.filterDataByYear(min_year, max_year);
      trackPiwik('filterData', 'filterDataByYear', ['Y' + min_year, 'Y' + max_year]);
    } else if (hasPerson && !hasTopic && !hasYear) {
      this.filterDataByPerson(person_id);
      trackPiwik('filterData', 'filterDataByYear', 'P' + person_id);
    } else if (!hasPerson && hasTopic && !hasYear) {
      this.filterDataByTopic(topic_id);
      trackPiwik('filterData', 'filterDataByYear', 'T' + topic_id);
    } else if (hasPerson && !hasTopic && hasYear) {
      this.filterDataByYearAndPerson(min_year, max_year, person_id);
      trackPiwik('filterData', 'filterDataByYearAndPerson', ['P' + person_id, 'Y' + min_year, 'Y' + max_year]);
    } else if (!hasPerson && hasTopic && hasYear) {
      this.filterDataByYearAndTopic(min_year, max_year, topic_id);
      trackPiwik('filterData', 'filterDataByYearAndTopic', ['T' + topic_id, 'Y' + min_year, 'Y' + max_year]);
    } else if (hasPerson && hasTopic && !hasYear) {
      this.filterDataByPersonAndTopic(person_id, topic_id);
      trackPiwik('filterData', 'filterDataByPersonAndTopic', ['P' + person_id, 'T' + topic_id]);
    } else if (hasPerson && hasTopic && hasYear) {
      this.filterDataByYearAndPersonAndTopic(min_year, max_year, person_id, topic_id);
      trackPiwik('filterData', 'filterDataByYearAndPersonAndTopic', ['P' + person_id, 'T' + topic_id, 'Y' + min_year, 'Y' + max_year]);
    } else {
      trackPiwik('filterData', 'Start Filter');
      const {defaultItems, defaultTopics, defaultYears, defaultPersons, defaultNetworkLinks, defaultPersonYears} = this.dataStore;
      this.setPerson(defaultPersons);
      this.setTopic(defaultTopics);
      this.setYear(defaultYears);
      this.setItems(defaultItems);
      this.setNetworkLinks(defaultNetworkLinks);
      this.setPersonYears(defaultPersonYears);
    }

    if (networkLinksRequired) this.dataStore.networkLinksAvailable = true;
  }

  filterDataByPerson(personID: string): void {
    this.api.filterDataByPersonResultTopic(personID).subscribe(data => this.setTopic(data));
    this.api.filterDataByPersonResultYear(personID).subscribe(data => this.setYear(data));

    this.api.filterDataByPersonResultPerson(personID).subscribe(data => {
      this.api.getYearsForMultiplePersons(data.map(d => d.id)).subscribe(years => this.setPersonYears(years));
      this.setPerson(data);
    });
    this.api.filterDataByPersonResultItems(personID).subscribe(data => this.setItems(data));
    if (this.load.network) this.api.getTopicNetworkFilterPerson(personID).subscribe(data => this.setNetworkLinks(data));
  }

  filterDataByTopic(topicID: string): void {
    this.api.filterDataByTopicResultPerson(topicID).subscribe(data => {
      this.api.getYearsForMultiplePersonsFilterTopics(data.map(d => d.id), topicID).subscribe(years => this.setPersonYears(years));
      return this.setPerson(data);
    });
    this.api.filterDataByTopicResultTopic(topicID).subscribe(data => this.setTopic(data));
    this.api.filterDataByTopicResultYear(topicID).subscribe(data => this.setYear(data));
    this.api.filterDataByTopicResultItems(topicID).subscribe(data => this.setItems(data));
    if (this.load.network) this.api.getTopicNetworkFilterTopic(topicID).subscribe(data => this.setNetworkLinks(data));
  }

  filterDataByYear(minYear: number, maxYear: number): void {
    this.api.filterDataByYearResultPerson(minYear, maxYear).subscribe(data => {
      this.api.getYearsForMultiplePersons(data.map(d => d.id)).subscribe(years => this.setPersonYears(years));
      return this.setPerson(data);
    });
    this.api.filterDataByYearResultTopic(minYear, maxYear).subscribe(data => this.setTopic(data));
    this.api.filterDataByYearResultItems(minYear, maxYear).subscribe(data => this.setItems(data));
    if (this.load.network) this.api.getTopicNetworkFilterYear(minYear, maxYear).subscribe(data => this.setNetworkLinks(data));
    this.setYear(this.dataStore.defaultYears);
  }

  filterDataByYearAndPerson(minYear: number, maxYear: number, personID: string): void {
    this.api.filterDataForYearPersonResultYear(personID).subscribe(data => this.setYear(data));
    this.api.filterDataForYearPersonResultPerson(minYear, maxYear, personID).subscribe(data => {
      this.api.getYearsForMultiplePersons(data.map(d => d.id)).subscribe(years => this.setPersonYears(years));
      this.setPerson(data);
    });
    this.api.filterDataForYearPersonResultTopic(minYear, maxYear, personID).subscribe(data => this.setTopic(data));
    this.api.filterDataForYearPersonResultItems(minYear, maxYear, personID).subscribe(data => this.setItems(data));
    if (this.load.network) this.api.getTopicNetworkFilterYearPerson(minYear, maxYear, personID).subscribe(data => this.setNetworkLinks(data));
  }

  filterDataByPersonAndTopic(personID: string, topicID: string): void {
    this.api.filterDataForPersonTopicResultYear(personID, topicID).subscribe(data => this.setYear(data));
    this.api.filterDataForPersonTopicResultTopic(personID, topicID).subscribe(data => this.setTopic(data));
    this.api.filterDataForPersonTopicResultPerson(personID, topicID).subscribe(data => {
      this.api.getYearsForMultiplePersonsFilterTopics(data.map(d => d.id), topicID).subscribe(years => this.setPersonYears(years));
      this.setPerson(data);
    });
    this.api.filterDataForPersonTopicResultItems(personID, topicID).subscribe(data => this.setItems(data));
    if (this.load.network) this.api.getTopicNetworkFilterPersonTopic(personID, topicID).subscribe(data => this.setNetworkLinks(data));
  }

  filterDataByYearAndTopic(minYear: number, maxYear: number, topicID: string): void {
    this.api.filterDataForYearTopicResultYear(topicID).subscribe(data => this.setYear(data));
    this.api.filterDataForYearTopicResultPerson(minYear, maxYear, topicID).subscribe(data => {
      this.api.getYearsForMultiplePersonsFilterTopics(data.map(d => d.id), topicID).subscribe(years => this.setPersonYears(years));
      this.setPerson(data);
    });
    this.api.filterDataForYearTopicResultItems(minYear, maxYear, topicID).subscribe(data => this.setItems(data));
    this.api.filterDataForYearTopicResultTopic(minYear, maxYear, topicID).subscribe(data => this.setTopic(data));
    if (this.load.network) this.api.getTopicNetworkFilterYearTopic(minYear, maxYear, topicID).subscribe(data => this.setNetworkLinks(data));
  }

  filterDataByYearAndPersonAndTopic(minYear: number, maxYear: number, personID: string, topicID: string): void {
    this.api.filterDataForYearPersonTopicResultYear(personID, topicID).subscribe(data => this.setYear(data));
    this.api.filterDataForYearPersonTopicResultItems(minYear, maxYear, personID, topicID).subscribe(data => this.setItems(data));
    this.api.filterDataForYearPersonTopicResultPerson(minYear, maxYear, personID, topicID).subscribe(data => {
      this.api.getYearsForMultiplePersonsFilterTopics(data.map(d => d.id), topicID).subscribe(years => this.setPersonYears(years));
      this.setPerson(data);
    });
    this.api.filterDataForYearPersonTopicResultTopic(minYear, maxYear, personID, topicID).subscribe(data => this.setTopic(data));
    if (this.load.network) this.api.getTopicNetworkFilterYearPersonTopic(minYear, maxYear, personID, topicID).subscribe(data => this.setNetworkLinks(data));
  }


  getResultsForNextPage () {
    this.page += 1;
    this.requestResultsforPage(this.page);
  }
  requestResultsforPage (page: number) {
    const {person_id, topic_id, min_year, max_year, hasPerson, hasTopic, hasYear} = this.getFilter();
    const {items} = this.dataStore;

    if (!hasPerson && !hasTopic && !hasYear) {
      this.api.getResultsForPage(this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    } else if (!hasPerson && !hasTopic && hasYear) {
      this.api.filterDataByYearResultItems(min_year, max_year, this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    } else if (hasPerson && !hasTopic && !hasYear) {
      this.api.filterDataByPersonResultItems(person_id, this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    } else if (!hasPerson && hasTopic && !hasYear) {
      this.api.filterDataByTopicResultItems(topic_id, this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    } else if (hasPerson && !hasTopic && hasYear) {
      this.api.filterDataForYearPersonResultItems(min_year, max_year, person_id, this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    } else if (!hasPerson && hasTopic && hasYear) {
      this.api.filterDataForYearTopicResultItems(min_year, max_year, topic_id, this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    } else if (hasPerson && hasTopic && !hasYear) {
      this.api.filterDataForPersonTopicResultItems(person_id, topic_id, this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    } else if (hasPerson && hasTopic && hasYear) {
      this.api.filterDataForYearPersonTopicResultItems(min_year, max_year, person_id, topic_id, this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    }
  }
}
