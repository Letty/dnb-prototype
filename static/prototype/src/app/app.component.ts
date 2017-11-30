import {Component, OnInit} from '@angular/core';
import {IYear, IPerson, ITopic} from './app.interfaces';
import {SelectionService} from './services/selection.service';
import {RouterService} from './services/router.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';

  public showPerson = true;
  public showTopic = true;

  public showInformation = false;

  constructor(
    private routerService: RouterService
  ) {}

  ngOnInit(): void {
    this.routerService.view.subscribe(view => {
      this.showPerson = view !== 'topic';
      this.showTopic = view !== 'person';
    });
    this.routerService.showInfo$.subscribe(show => {
      this.showInformation = show;
    });
  }

  toggleInformation(): void {
    this.routerService.toggleInfo();
  }
}
