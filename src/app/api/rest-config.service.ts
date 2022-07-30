/* eslint-disable */
import {Injectable} from '@angular/core';
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestConfigService {

  constructor(private http: HttpClient) {
  }
  getHeaders() {
    const headers = {};
    // @ts-ignore
    headers['Content-Type'] = 'application/json';
    return headers;
  }
  public post<T>(url: string, body: any, opts?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }) {
    if (!opts) {
      const headers = this.getHeaders();
      opts = {headers: new HttpHeaders(headers)};
      opts.withCredentials = true;
    }
    return this.http.post(environment.apiUrl + url, body, opts) as Observable<T>;
  }

  public get<T>(url: string, opts?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }) {
    if (!opts) {
      const headers = this.getHeaders();
      opts = {headers: new HttpHeaders(headers)};
      opts.withCredentials = true;
    }
    return this.http.get<T>(environment.apiUrl + url, opts) as Observable<T>;
  }
}
