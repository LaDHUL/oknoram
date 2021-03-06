import { PageRequest } from './page-request';

export class Page<T> extends PageRequest {
  private content_: T[];

  constructor(pageIndex: number, totalCount: number, content: T[]) {
    super(pageIndex, totalCount);
    this.content_ = content;
  }

  get content(): T[] {
    return this.content_;
  }

  pageRequest(index: number): PageRequest {
    return new PageRequest(index, this.totalCount_);
  }
}
