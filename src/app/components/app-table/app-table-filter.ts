import {AppTableSort} from "./app-table-sort";

export class AppTableFilter<T> {
    query: string;
    page = 1;
    maxResults = 15;
    sort: AppTableSort;
    constructor() {
    }
}
