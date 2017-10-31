import {Component} from '@angular/core';
import {IYear, IPerson, ITopic} from './app.interfaces';
import {SelectionService} from './services/selection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
}
