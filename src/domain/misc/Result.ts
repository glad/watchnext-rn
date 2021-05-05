import {Entity} from '../entities';
import {Throwable} from '../throwables';

export interface ResultProps<T extends Entity | Entity[]> {
  readonly data?: T;
  readonly throwable?: Throwable;
  readonly currentPage?: number;
  readonly hasPrevious?: boolean;
  readonly hasNext?: boolean;
}

export class Result<T extends Entity | Entity[]> {
  readonly data?: T = undefined;
  readonly hasPrevious: boolean = false;
  readonly currentPage: number = 1;
  readonly hasNext: boolean = false;
  readonly throwable?: Throwable;

  constructor({
    data,
    currentPage,
    hasPrevious,
    hasNext,
    throwable,
  }: ResultProps<T>) {
    this.data = data;
    this.currentPage = Math.max(1, currentPage || 1);
    this.hasNext = hasNext || false;
    this.hasPrevious = hasPrevious || false;
    this.throwable = throwable;
  }
}
