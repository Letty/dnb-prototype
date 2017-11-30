import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

import {formatNum, formatTitleResult, formatTotalResult, formatTagAction} from '../../services/formatting';

@Component({
  selector: 'collapsed-tags',
  templateUrl: './collapsed-tags.component.html',
  styleUrls: ['./collapsed-tags.component.scss']
})

export class CollapsedTagsComponent implements OnInit {
  @Output() selection: EventEmitter<any> = new EventEmitter();
  @Input() tags = [];
  @Input() totalResults: number = null;
  @Input() selectedTag: any = null;
  @Input() isResultBar = false;
  @Input() loadingData = false;

  @Input() showTags = false;

  constructor() {}

  ngOnInit () {
  }

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
