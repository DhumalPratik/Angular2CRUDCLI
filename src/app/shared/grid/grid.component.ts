import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Config } from '../config';
import { ColumnConfig } from '../column-config';
@Component({
  selector: 'app-grid',
  templateUrl: 'app/shared/grid/grid.component.html',
  styleUrls: ['app/shared/grid/grid.component.css']
})
export class GridComponent implements OnInit {
  @Input()
  config: Config;
  @Output()
  rowClick = new EventEmitter();
  filteredList: any[] = [];
  List: any[] = [];
  colList = [];
  searchText: string;
  isAsc: boolean = false;
  rClick(input, callBack) {
    this.rowClick.emit({
      Data: input,
      Function: callBack
    });
  }
  ngOnInit() {
    this.List = this.config.DataSource;
    this.filteredList = this.config.DataSource;
    if (!this.config.DisplayAllColumns) {
      this.colList = this.config.DisplayColumns;
    } else {
      Object.keys(this.config.DataSource[0]).forEach(x => {
        this.colList.push(new ColumnConfig({
          ColumnName: x
        }));
      });
    }
  }
  sort(fieldName) {
    let self = this;
    self.isAsc = !self.isAsc;
    self.filteredList.sort(function (a, b) {
      return (self.isAsc ? 1 : -1) * ((a[fieldName] < b[fieldName]) ? -1 : (a[fieldName] > b[fieldName]) ? 1 : 0);
    });
  }
  search() {
    let self = this;
    if (this.searchText) {
      let searchText = this.searchText.toLowerCase();
      self.filteredList = this.List.filter(function (x) {
        for (let v in x) {
          try {
            if (x[v] && x[v].toString().toLowerCase().indexOf(searchText) != -1) {
              return true;
            } else continue;
          } catch (error) {
            console.log(v);
            console.log(error);
          }
        }
        return false;
      });
    }
  }
  constructor() { }
}
