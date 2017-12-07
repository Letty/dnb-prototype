import {Component, Input, Output, EventEmitter} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'information-modal',
  templateUrl: './information-modal.component.html',
  styleUrls: ['./information-modal.component.scss'],
  animations: [
  trigger('fadeInOut', [
    transition(':enter', [
      style({opacity: 0}),
      animate(200, style({opacity: 1}))
    ]),
    transition('in => out', [
      animate(200, style({opacity: 0}))
    ])
  ]),
  trigger('slideInOut', [
    transition(':enter', [
      style({transform: 'translate(-50%, -53%) scale(0.9)', opacity: 0}),
      animate(200, style({transform: 'translate(-50%, -50%) scale(1)', opacity: 1}))
    ]),
    transition('in => out', [
      animate(200, style({transform: 'translate(-50%, -53%) scale(0.9)', opacity: 0}))
    ])
  ])
]
})

export class InformationModalComponent {

  @Output() closeInformation: EventEmitter<any> = new EventEmitter();

  public inOut = 'in';

  constructor() {}

  close () {
    this.inOut = 'out';
  }

  animationDone (e) {
    if (e.toState === 'out') this.closeInformation.emit();
  }
}
