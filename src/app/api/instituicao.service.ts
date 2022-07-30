import {Injectable} from '@angular/core';
import {AppTableFilter} from "../components/app-table/app-table-filter";
import {AppTableResult} from "../components/app-table/app-table-result.model";
import {RestConfigService} from "./rest-config.service";
import {Instituicao} from "../models/instituicao.model";

const URL_FILTRAR = `/api/instituicoes/filtrar`;
const URL_BUSCAR_POR_ID = `/api/instituicao/buscarPorId/`;
const URL_SALVAR = `/api/instituicao/salvar`;
const URL_EXCLUIR = `/api/instituicao/excluir/`;
const URL_PESQUISAR = `/api/insitituicao/pesquisar`;

@Injectable({
  providedIn: 'root'
})
export class InstituicaoService {

  constructor(private rest: RestConfigService) {
  }
  filtrar(filter: AppTableFilter<Instituicao>) {
    return this.rest.post<AppTableResult<Instituicao>>(URL_FILTRAR, JSON.stringify(filter));
  }

  buscarPorId(id: number) {
    return this.rest.get<Instituicao>(URL_BUSCAR_POR_ID+ id);
  }

  salvar(instituicao: Instituicao) {
    return this.rest.post<Instituicao>(URL_SALVAR, JSON.stringify(instituicao));
  }

  excluir(id: number) {
    return this.rest.get(URL_EXCLUIR + id);
  }

  pesquisar(query: string) {
    return this.rest.post(URL_PESQUISAR, JSON.stringify({query}));
  }
}
