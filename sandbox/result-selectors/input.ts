import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const source$ = of();
source$.pipe(
  mergeMap(
    (outer: number) => of(outer + outer),
    (outer, inner) => [outer, inner]
  )
);
