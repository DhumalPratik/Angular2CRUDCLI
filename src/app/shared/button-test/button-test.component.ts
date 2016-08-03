import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ButtonTestTheme, ActionTypes, ButtonTypes } from '../theme/button-test-theme';


@Component({
  selector: 'button-test',
  templateUrl: 'app/shared/button-test/button-test.component.html',
  styleUrls: ['app/shared/button-test/button-test.component.css', 'app/shared/apollo.css']
})
export class ButtonTestComponent implements OnInit {

  @Input()
  actionType: ActionTypes;
  @Input()
  className: string;
  @Input()
  theme: ButtonTestTheme;
  @Input()
  type: ButtonTypes;// = ButtonTypes.button;
  @Input()
  value: string;
  @Output()
  onClick = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.className = "btn " + ButtonTestTheme.classes[this.actionType] + " " + this.className;
  }

  handleClick(e) {
    this.onClick.emit(e);
  }

}
