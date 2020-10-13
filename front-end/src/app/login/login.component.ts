import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from '../token-storage.service';
import {AuthenticationService} from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {};
  isAuthenticated = false;
  isLoginFailed = false;

  constructor(private tokenStorageService: TokenStorageService, private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.isAuthenticated = this.tokenStorageService.hasTokenNonExpired();
  }

  onSubmit(): void {
    this.authenticationService.login(this.form).subscribe(
      data => {
        this.tokenStorageService.saveToken(data.accessToken);
        this.isAuthenticated = true;
        this.isLoginFailed = false;
        this.reloadPage();
      },
      () => {
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}
