import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppTableFilter} from "../../components/app-table/app-table-filter";
import {Instituicao} from "../../models/instituicao.model";
import {InstituicaoService} from "../../api/instituicao.service";
import {AsyncMatTableSource} from "../../components/app-table/async-table-data.service";
import {tap} from "rxjs/operators";
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToolbarService} from "../../_metronic/layout/core/toolbar.service";
import {Subscription, timer} from "rxjs";
import {AppTableSort} from "../../components/app-table/app-table-sort";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-crud-teste',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss'],
})
export class CrudComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['id', 'nome', 'acoes'];
  dataSource: AsyncMatTableSource<Instituicao>;
  pageLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [3, 10, 20];
  filters: AppTableFilter<Instituicao>;
  form: FormGroup;
  formPesquisa: FormGroup;
  state = 'ST_LIST';
  isSaving = false;
  constructor(
    private fb: FormBuilder,
    private instituicaoService: InstituicaoService) {
    this.formPesquisa = this.fb.group({
      query: ['']
    });
  }
  editar(id: number = 0){
    this.state = 'ST_EDIT';
    this.form = this.fb.group({
      id: [''],
      nome: ['', Validators.required]
    });
    if (id>0){
      this.instituicaoService.buscarPorId(id).subscribe(instituicao => {
        this.form.patchValue(instituicao);
      })
    }
  }
  excluir(id: number){
    const instituicao = new Instituicao();
    instituicao.id = id;
    this.instituicaoService.excluir(id).subscribe(()=>{
      this.dataSource.deleteItem(instituicao);
      this.listMode();
    })
  }
  listMode(){
    this.state = 'ST_LIST';
  }
  salvar() {
    if (!this.form.valid) {
      return;
    }
    this.form.disable();
    this.instituicaoService.salvar(this.form.value).subscribe((instituicao) => {
      this.dataSource.insertOrUpdateItem(instituicao);
      this.listMode();
    });
  }
  ngAfterViewInit() {
    var source = (filter: AppTableFilter<Instituicao>) => {
      const customFilter = {id: '34'};
      filter = {...customFilter, ...filter};
      return this.instituicaoService.filtrar(filter);
    }

    this.dataSource = new AsyncMatTableSource(source);
    this.dataSource.resultSubject.subscribe(result => {
      if (result){
        this.pageLength = result.count;
      }
    });
    timer(200).subscribe(()=>{
      this.paginator.page
        .pipe(
          tap(() => this.doSearch())
        )
        .subscribe();
      this.doSearch()
    })
  }

  doSearch() {
    if (!this.filters) {
      this.filters = new AppTableFilter();
    }
    this.filters.query = this.formPesquisa.get('query')?.value;
    this.filters.maxResults = this.paginator.pageSize;
    this.filters.page = this.paginator.pageIndex;
    this.dataSource.loadBy(this.filters);
  }

  ngOnInit() {
  }

  sort(evt: any) {
    if (!this.filters) {
      this.filters = new AppTableFilter();
    }
    this.filters.sort = new AppTableSort();
    this.filters.sort.field = evt.active;
    this.filters.sort.direction = evt.direction;
    this.doSearch();
    console.log(evt);
  }

  ngOnDestroy(): void {

  }
}
