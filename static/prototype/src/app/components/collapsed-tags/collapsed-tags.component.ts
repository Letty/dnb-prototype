import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'collapsed-tags',
  templateUrl: './collapsed-tags.component.html',
  styleUrls: ['./collapsed-tags.component.scss']
})

export class CollapsedTagsComponent implements OnInit {
  @Output() selection: EventEmitter<any> = new EventEmitter();
  @Input() tags = [];

  constructor() {}

  ngOnInit () {
  }

  selected (node) {
    this.selection.emit(node);
  }
}
