import {Component, Input} from '@angular/core';
import {RouterService} from '../../services/router.service';

@Component({
  selector: 'btn-link',
  templateUrl: './btn-link.component.html',
  styleUrls: ['./btn-link.component.scss']
})

export class BtnLinkComponent {
  @Input() fullWidth = false;
  @Input() value: '0';
  @Input() sectionTitle = '';
  @Input() icon = 'arrow-right';
  @Input() invert = false;
  @Input() route: string = null;

  constructor(private router: RouterService) { }

  clicked(): void {
    this.router.setView(this.route || 'index');
  }
}
