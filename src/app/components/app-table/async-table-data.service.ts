import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {AppTableFilter} from './app-table-filter';
import {AppTableResult} from './app-table-result.model';

export class AsyncMatTableSource<T> implements DataSource<T> {


  // @ts-ignore
  public resultSubject = new BehaviorSubject<AppTableResult<T>>(null);
  private itemsSubject = new BehaviorSubject<T[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private source: (filter: AppTableFilter<T>) => Observable<AppTableResult<any>>) {
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.itemsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.itemsSubject.complete();
    this.loadingSubject.complete();
  }

  loadBy(filter: AppTableFilter<any>) {
    this.loadingSubject.next(true);
    this.source(filter)
      .pipe(
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(res => {
        this.resultSubject.next(res);
        this.itemsSubject.next(res.data);
      });
  }

  getItems() {
    return this.itemsSubject.getValue();
  }

  insertOrUpdateItem(item: T) {
    const index = this.getItemIndex(item);
    if (index > -1) {
      this.updateItem(item, index);
    } else {
      this.addFirstItem(item);
    }
  }

  deleteItem(item: T) {
    const index = this.getItemIndex(item);
    if (index > -1) {
      this.deleteItemByIndex(index);
    }
  }

  getItemIndex(item: T) {
    const list = this.getItems();
    // @ts-ignore
    return list.map((e) => e.id).indexOf(item.id);
  }

  addFirstItem(item: T) {
    let items = this.getItems();
    items = [item, ...items];
    this.itemsSubject.next(items);
  }

  updateItem(item: T, index: number) {
    const list = this.getItems();
    list.splice(index, 1, item);
    this.itemsSubject.next(list);
  }

  deleteItemByIndex(index: number) {
    const list = this.getItems();
    list.splice(index, 1);
    this.itemsSubject.next(list);
  }
}
