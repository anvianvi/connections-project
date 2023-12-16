import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  private countdownSubjects: { [key: string]: BehaviorSubject<number | null> } =
    {};
  private destroySubjects: { [key: string]: Subject<void> } = {};

  startCountdown(countdownSeconds: number, identifier: string): void {
    let secondsRemaining = countdownSeconds;

    this.countdownSubjects[identifier] = new BehaviorSubject<number | null>(
      null
    );
    this.destroySubjects[identifier] = new Subject<void>();

    timer(0, 1000)
      .pipe(takeUntil(this.destroySubjects[identifier]))
      .subscribe(() => {
        if (secondsRemaining > 0) {
          secondsRemaining--;
          this.countdownSubjects[identifier].next(secondsRemaining);
        } else {
          this.stopCountdown(identifier);
        }
      });
  }

  stopCountdown(identifier: string): void {
    this.countdownSubjects[identifier].next(null);
    this.destroySubjects[identifier].next();
    delete this.countdownSubjects[identifier];
    delete this.destroySubjects[identifier];
  }

  getCountdown(identifier: string): Observable<number | null> {
    return this.countdownSubjects[identifier].asObservable();
  }
}
