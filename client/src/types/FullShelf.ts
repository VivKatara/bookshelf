export interface FullShelfIsbnState {
  firstShelfIsbn: Array<string>;
  secondShelfIsbn: Array<string>;
  thirdShelfIsbn: Array<string>;
}

export interface FullShelfPageState {
  totalPages: number;
  showPrevious: boolean;
  showNext: boolean;
  showPageCount: boolean;
}
