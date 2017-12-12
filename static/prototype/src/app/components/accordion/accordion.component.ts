import {Component, Input, OnInit} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {RouterService} from '../../services/router.service';

@Component({
  selector: 'accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  animations: [
  trigger('scale', [
    state('0', style({height: '40px'})),
    state('1', style({height: 'calc(50% - 20px)'})),
    state('2', style({height: 'calc(100% - 80px)'})),
    transition('* <=> *', animate('400ms ease'))
  ])]
})

export class AccordionComponent implements OnInit {
  @Input() label: string = null;
  @Input() route: string = null;

  public size = 0;

  constructor(private router: RouterService) {}

  ngOnInit () {
    this.router[this.route].subscribe(size => {
      this.size = size;
    });
  }

  toggle (): void {
    this.router.toggle(this.route);
  }
}
