import {BehaviorSubject, Observable} from 'rxjs';
import {AppTableResult} from './app-table-result.model';
import {AppTableFilter} from './app-table-filter';
import {TemplateRef} from '@angular/core';
import {TableColumn} from "./table-column.interface";

export interface AfterSearchItemsCallback<T> {
  afterChangeFn?: (result: AppTableResult<T>) => Promise<void>;
  beforeChangeFn?: (result: AppTableResult<T>) => Promise<void>;
}

export interface ChangedItemCallback<T> {
  confirmation: BehaviorSubject<T>;
  afterChangeFn?: (item: T) => Promise<T>;
  beforeChangeFn?: (item: T) => Promise<T>;
}

export interface ItemRowMenu<T> {
  icon: any;
  label: string;
  callback?: (item: T) => () => void;
}

export class AppTableConfig<T> {
  title?: string;
  crumbs?: string[];
  rowActionsTemplate?: TemplateRef<any>;
  selectActionsTemplate?: TemplateRef<any>;
  createFn?: () => void;
  editFn?: (item: T) => void;
  columns?: TableColumn<T>[] = [];
  dataSource?: string;
  source?: (filter: AppTableFilter<T>) => Observable<AppTableResult<T>>;
  filter?: (filter: AppTableFilter<T>) => AppTableFilter<T>;
  onInsertItem?: BehaviorSubject<T> | ChangedItemCallback<T>;
  onDeleteItem?: BehaviorSubject<T> | ChangedItemCallback<T>;
  onUpdateItem?: BehaviorSubject<T> | ChangedItemCallback<T> | Array<ChangedItemCallback<T>>;
  beforeSearch?: () => void;
  afterSearch?: Observable<any> | AfterSearchItemsCallback<T>;

  constructor() {
  }
}
