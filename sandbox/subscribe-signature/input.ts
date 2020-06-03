import { of } from 'rxjs';

const source$ = of();

source$.subscribe((value) => console.log(value));

source$.subscribe(
  (value) => console.log(value),
  (err) => console.error(err)
);

class Bar {
  baz() {
    source$.subscribe(
      (val) => console.log(val),
      null,
      () => iAmComplete()
    );
  }
}

function iAmComplete() {}
