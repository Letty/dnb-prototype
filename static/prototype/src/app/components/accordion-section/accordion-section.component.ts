import {Component, Input, OnInit} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {RouterService} from '../../services/router.service';

@Component({
  selector: 'accordion-section',
  templateUrl: './accordion-section.component.html',
  styleUrls: ['./accordion-section.component.scss'],
  animations: [
  trigger('scale', [
    state('0', style({height: '40px'})),
    state('1', style({height: 'calc(50% - 20px)'})),
    state('2', style({height: 'calc(100% - 80px)'})),
    transition('* <=> *', animate('400ms ease'))
  ])]
})

export class AccordionSectionComponent implements OnInit {
  @Input() title: string = null;
  @Input() route: string = null;

  public size = 0;

  constructor(private router: RouterService) { }

  ngOnInit () {
    console.log(this.route);
    console.log(this.router.view);
    this.router[this.route].subscribe(size => {
      this.size = size;
    });
  }

  toggle(): void {
    console.log('clicked', this.route);
    this.router.toggle(this.route);
  }
}
