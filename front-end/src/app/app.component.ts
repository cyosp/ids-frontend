import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from './token-storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Ids';
  isAuthenticated = false;

  constructor(private tokenStorageService: TokenStorageService, private router: Router) {
  }

  ngOnInit(): void {
    this.isAuthenticated = this.tokenStorageService.hasTokenNonExpired();
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
