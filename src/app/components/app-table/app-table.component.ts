import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {AppTableConfig} from './app-table-config';
import {timer} from 'rxjs';
import {AppTableFilter} from './app-table-filter';
import {SelectionModel} from '@angular/cdk/collections';
import {AsyncMatTableSource} from './async-table-data.service';
import {tap} from 'rxjs/operators';
import {TableColumn} from "./table-column.interface";

@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.scss'],
})
export class AppTableComponent<T> implements OnInit, AfterViewInit, AfterViewChecked, AfterContentInit, OnDestroy {
  title: string;
  columns: TableColumn<T>[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  matDataSource: MatTableDataSource<T> | null;
  dataSource: AsyncMatTableSource<T>;
  pageLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [3, 10, 20];
  searchCtrl = new FormControl();
  selection = new SelectionModel<T>(true, []);
  config: AppTableConfig<T>;
  filters: AppTableFilter<T>;
  items: T[];
  isStarting = true;
  isSearching = false;

  constructor() {
  }

  pageEvents(event: any) {
    console.log(event.pageIndex);
    console.log(event.pageSize);
  }

  setConfig(config: AppTableConfig<T>, autoStart = true) {
    this.isStarting = true;
    this.config = config;
    timer(250).subscribe(() => {
      this.isStarting = false;
      if (autoStart && this.config.source) {
        this.dataSource = new AsyncMatTableSource(this.config.source);
        this.dataSource.resultSubject.subscribe(result => {
          if (result){
            this.pageLength = result.count;
          }
        });
        this.doSearch();
      }
    });
  }

  formatRowValue(row: any, property:any) {
    const splited = property.split('.');
    let value = row;
    for (const name of splited) {
      if (!value) {
        return;
      }
      value = value[name];
    }
    return value;
  }

  doSearch(query = '') {
    this.isSearching = true;
    if (this.config.filter) {
      this.filters = this.config.filter(this.filters);
    }
    if (!this.filters) {
      this.filters = new AppTableFilter();
    }
    this.filters.query = query;
    this.filters.maxResults = this.paginator.pageSize;
    this.filters.page = this.paginator.pageIndex;
    this.dataSource.loadBy(this.filters);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    // @ts-ignore
    const numRows = this.matDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      // @ts-ignore
      this.matDataSource.data.forEach(row => this.selection.select(row));
  }

  ngOnInit() {
    this.matDataSource = new MatTableDataSource();
  }

  new() {
    if (this.config.createFn) {
      this.config.createFn();
    }
  }

  toggleColumnVisibility(column: any, event: any) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }


  ngAfterViewChecked() {

  }

  ngAfterContentInit() {
  }

  trackByProperty(index: number, column: TableColumn<T>) {
    return column.property;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngAfterViewInit() {
    // this.matDataSource.paginator = this.paginator;
    // this.matDataSource.sort = this.sort;

    this.paginator.page
      .pipe(
        tap(() => this.doSearch())
      )
      .subscribe();
  }

  ngOnDestroy() {

  }
}
