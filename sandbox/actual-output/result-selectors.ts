import { of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

const source$ = of();
source$.pipe(
  mergeMap((outer: number) => of(outer + outer).pipe(map((outer, inner) => [outer, inner])))
);
