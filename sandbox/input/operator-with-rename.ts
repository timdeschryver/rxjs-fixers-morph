import { of } from 'rxjs';
import {
  // remains untouched because it's renamed
  zip as renamedZip,

  // deprecated operators
  combineLatest,
  merge,
  concat,

  // another operator
  map,
} from 'rxjs/operators';

const source$ = of();
const s$ = of();

source$.pipe(
  renamedZip(s$),
  combineLatest(s$, s$),
  merge(s$),
  concat(s$),
  map((a) => a)
);
