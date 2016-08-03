import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Config } from '../config';
import { ColumnConfig } from '../column-config';

@Component({
  selector: 'app-detail',
  templateUrl: 'app/shared/detail/detail.component.html',
  styleUrls: ['app/shared/detail/detail.component.css']
})
export class DetailComponent implements OnInit {
  @Input()
  dConfig: Config;
  @Input()
  test: string;
  @Output()
  detailClick = new EventEmitter();
  List: any[] = [];
  colList = [];
  dClick(input, callBack) {
    this.detailClick.emit({
      Data: input,
      Function: callBack
    });
  }

  constructor() { }

  ngOnInit() {
    // console.log("Detail");
    // console.log(this.dConfig);
    this.List = this.dConfig.DataSource;
    if (!this.dConfig.DisplayAllColumns) {
      this.colList = this.dConfig.DisplayColumns;
    } else {
      Object.keys(this.dConfig.DataSource[0]).forEach(x => {
        this.colList.push(new ColumnConfig({
          ColumnName: x
        }));
      });
    }
  }

}
