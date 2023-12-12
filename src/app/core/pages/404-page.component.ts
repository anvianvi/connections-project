import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="not-found-wrapper">
      <span>Sorry, smth went wrong((</span>
    </div>
    <p>Redirecting to the home page in {{ counter }} seconds...</p>
  `,
  styles: [
    `
      ::ng-deep app-not-found {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .not-found-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 27px;

        span {
          max-width: 185px;
          color: #828282;
          font-size: 24px;
          font-weight: 700;
        }
      }
    `,
  ],
})
export class NotFoundComponent implements OnInit, OnDestroy {
  counter: number = 5;
  timer: ReturnType<typeof setTimeout> | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.counter -= 1;

      if (this.counter === 0) {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.router.navigate(['/']);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
