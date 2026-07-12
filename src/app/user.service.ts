import {Injectable} from '@angular/core';
import {Role} from './role';

const TOKEN_KEY = 'auth-token';
const USER_ROLE = 'user-role';
const USER_HOME = 'user-home';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  signOut(): void {
    window.localStorage.clear();
  }

  save(key: string, value: string): void {
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, value);
  }

  public saveToken(token: string): void {
    this.save(TOKEN_KEY, token);
  }

  public saveRole(role: string): void {
    this.save(USER_ROLE, role);
  }

  public saveHome(home: string): void {
    this.save(USER_HOME, home);
  }

  public hasTokenNonExpired(): boolean {
    const token = this.getToken();
    return !!token && this.nonExpired(token);
  }

  getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUserHome(): string {
    return localStorage.getItem(USER_HOME);
  }

  isAdministrator(): boolean {
    return (localStorage.getItem(USER_ROLE) as Role) === Role.ADMINISTRATOR;
  }

  isGuest(): boolean {
    return (localStorage.getItem(USER_ROLE) as Role) === Role.GUEST;
  }

  nonExpired(token: string): boolean {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date()).getTime() / 1000)) < expiry;
  }
}
