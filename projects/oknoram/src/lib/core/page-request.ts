export class PageRequest {
  private pageIndex_: number;
  protected totalCount_: number;
  protected pageCount_: number;

  protected constructor(
    pageIndex: number,
    totalCount: number,
    pageCount: number
  ) {
    this.pageIndex_ = pageIndex;
    this.totalCount_ = totalCount;
    this.pageCount_ = pageCount;
  }

  get pageIndex(): number {
    return this.pageIndex_;
  }

  get totalCount(): number {
    return this.totalCount_;
  }

  get pageCount(): number {
    return this.pageCount_;
  }
}
