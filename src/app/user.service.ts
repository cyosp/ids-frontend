import {Injectable} from '@angular/core';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  signOut(): void {
    window.localStorage.clear();
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public hasTokenNonExpired(): boolean {
    const token = this.getToken();
    return !!token && this.nonExpired(token);
  }

  getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

  nonExpired(token: string): boolean {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date()).getTime() / 1000)) < expiry;
  }
}
