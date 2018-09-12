export class PageRequest {
  private pageIndex_: number;
  protected totalCount_: number;

  protected constructor(pageIndex: number, totalCount: number) {
    this.pageIndex_ = pageIndex;
    this.totalCount_ = totalCount;
  }

  get pageIndex(): number {
    return this.pageIndex_;
  }

  get totalCount(): number {
    return this.totalCount_;
  }
}
