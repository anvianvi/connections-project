import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginResponse } from 'src/app/shared/interfaces/interfaces';
import { API_URL } from 'src/app/shared/variables/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  // public isLoggedIn: Observable<boolean> =
  //   this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
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
