import { of } from 'rxjs';

const source$ = of();

source$.subscribe((value) => console.log(value));

source$.subscribe({next: (value) => console.log(value), error: (err) => console.error(err)});

class Bar {
  baz() {
    source$.subscribe({next: (val) => console.log(val), error: () => {}, complete: () => iAmComplete()});
  }
}

function iAmComplete() {}
