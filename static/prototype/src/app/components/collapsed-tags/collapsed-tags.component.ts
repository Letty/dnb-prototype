import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

import {formatNum} from '../../services/formatting';

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
}
