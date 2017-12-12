import {Component, Input, Output, EventEmitter} from '@angular/core';
import {formatNum, formatTitleResult, formatTotalResult, formatTagAction} from '../../services/formatting';

@Component({
  selector: 'accordion-header',
  templateUrl: './accordion-header.component.html',
  styleUrls: ['./accordion-header.component.scss']
})

export class AccordionHeaderComponent {
  @Output() selection: EventEmitter<any> = new EventEmitter();
  @Input() tags = [];
  @Input() totalResults: number = null;
  @Input() selectedTag: any = null;
  @Input() isResultBar = false;
  @Input() loadingData = false;
  @Input() label: string = null;

  @Input() showTags = false;

  constructor() {}

  selected (node) {
    this.selection.emit(node);
  }

  _formatNum (d) {
    return formatNum(d);
  }

  _formatTitleResult(topic, subject, value) {
    return formatTitleResult(topic, subject, value);
  }

  _formatTotalResult(value) {
    return formatTotalResult(value);
  }

  _formatTagAction(subject, action) {
    return formatTagAction(subject, action);
  }
}
