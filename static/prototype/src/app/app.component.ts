import {Component} from '@angular/core';
import {IYear, IPerson, ITopic} from "./app.interfaces";
import {SelectionService} from "./services/selection.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  private selectedMinYear: number;
  private selectedMaxYear: number;
  private selectedPerson: IPerson;
  private selectedTopic: ITopic;


  constructor(private selection: SelectionService) {
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
}
