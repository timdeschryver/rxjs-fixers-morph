import { of } from 'rxjs';
import {
  // remains untouched because it's renamed
  zip as renamedZip,

  // deprecated operators
  combineLatestWith,
  mergeWith,
  concatWith,

  // another operator
  map,
} from 'rxjs/operators';

const source$ = of();
const s$ = of();

source$.pipe(
  renamedZip(s$),
  combineLatestWith(s$, s$),
  mergeWith(s$),
  concatWith(s$),
  map((a) => a)
);
