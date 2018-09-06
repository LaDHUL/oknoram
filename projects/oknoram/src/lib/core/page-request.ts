export class PageRequest {
  private pageIndex_: number;
  protected totalCount_: number;
  protected pageSize_: number;

  protected constructor(
    pageIndex: number,
    totalCount: number,
    pageSize: number
  ) {
    this.pageIndex_ = pageIndex;
    this.totalCount_ = totalCount;
    this.pageSize_ = pageSize;
  }

  get pageIndex(): number {
    return this.pageIndex_;
  }

  get totalCount(): number {
    return this.totalCount_;
  }

  get pageSize(): number {
    return this.pageSize_;
  }
}
