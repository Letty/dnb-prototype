import {Component, Input} from '@angular/core';

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
}
