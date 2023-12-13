import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor(private datePipe: DatePipe) {}

  formatUnixTimestamp(timestampInput: string): string {
    const timestamp = Number(timestampInput);
    const date = new Date(timestamp);
    return this.datePipe.transform(date, 'medium') || '';
  }
}
