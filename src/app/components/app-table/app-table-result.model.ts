export class AppTableResult<T> {
  pages: number;
  page: number;
  count: number;
  data: T[] = [];

  constructor() {
  }
}
