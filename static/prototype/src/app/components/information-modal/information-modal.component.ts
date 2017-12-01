import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'information-modal',
  templateUrl: './information-modal.component.html',
  styleUrls: ['./information-modal.component.scss'],
  animations: [
  trigger('fadeInOut', [
    transition(':enter', [   // :enter is alias to 'void => *'
      style({opacity: 0}),
      animate(200, style({opacity: 1}))
    ]),
    transition('in => out', [
      animate(200, style({opacity: 0}))
    ])
  ]),
  trigger('slideInOut', [
    transition(':enter', [   // :enter is alias to 'void => *'
      style({transform: 'translate(-50%, -53%) scale(0.9)', opacity: 0}),
      animate(200, style({transform: 'translate(-50%, -50%) scale(1)', opacity: 1}))
    ]),
    transition('in => out', [
      animate(200, style({transform: 'translate(-50%, -53%) scale(0.9)', opacity: 0}))
    ])
  ])
]
})

export class InformationModalComponent implements OnInit, OnChanges {

  @Output() closeInformation: EventEmitter<any> = new EventEmitter();

  public inOut = 'in';

  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges (changes: SimpleChanges) {
  }

  close () {
    this.inOut = 'out';
  }

  animationDone (e) {
    if (e.toState === 'out') this.closeInformation.emit();
  }
}
