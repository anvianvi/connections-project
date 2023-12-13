import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ProfileService } from 'src/app/core/services/profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private profileServise: ProfileService) {
    this.checkAuthentication();
  }

  private checkAuthentication() {
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    const email = localStorage.getItem('email');

    const isAuthenticated = !!token && !!uid && !!email;
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  login(token: string, uid: string, email: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('uid', uid);
    localStorage.setItem('email', email);

    this.isAuthenticatedSubject.next(true);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    localStorage.removeItem('email');

    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
