import {Component} from '@angular/core';
import {IYear, IPerson, ITopic} from '../../app.interfaces';
import {SelectionService} from '../../services/selection.service';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'dnb-header',
  templateUrl: './dnb-header.component.html',
  styleUrls: ['./dnb-header.component.scss']
})

export class DnbHeaderComponent {
  public selectedMinYear: number;
  public selectedMaxYear: number;
  public selectedPerson: IPerson;
  public selectedTopic: ITopic;


  constructor(
    private selection: SelectionService,
    private dataService: DataService
  ) {
    selection.selPerson$.subscribe(
      person => {
        this.selectedPerson = person;
      }
    );

    selection.selTopic$.subscribe(
      topic => {
        this.selectedTopic = topic;
      }
    );

    selection.selMinYear$.subscribe(
      year => {
        this.selectedMinYear = year;
      }
    );
    selection.selMaxYear$.subscribe(
      year => {
        this.selectedMaxYear = year;
      }
    );
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
}
