import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

const source$ = of();
source$.pipe(
  tap(() => console.log('foo')),
  tap(
    (value) => console.log(value),
    (err) => console.error(err)
  ),
  tap(
    (value) => console.log(value),
    undefined,
    () => console.log('complete')
  )
);

source$.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.error(err),
});
