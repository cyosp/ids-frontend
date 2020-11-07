import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from '../token-storage.service';
import {AuthenticationService} from '../authentication.service';
import {ListQuery} from '../list-query.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {};
  isAuthenticated = false;
  isLoginFailed = false;

  constructor(private tokenStorageService: TokenStorageService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private userListQuery: ListQuery) {
  }

  ngOnInit(): void {
    this.isAuthenticated = this.tokenStorageService.hasTokenNonExpired();
  }

  onSubmit(): void {
    this.authenticationService.login(this.form).subscribe(
      dataRest => {
        this.tokenStorageService.saveToken(dataRest.accessToken);
        this.isAuthenticated = true;
        this.isLoginFailed = false;
        this.router.navigate(['gallery']);

        this.userListQuery.fetch()
          .subscribe(({data}) => console.log(data));
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
