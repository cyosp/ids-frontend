import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from '../token-storage.service';
import {AuthenticationService} from '../authentication.service';
import {ListQuery} from '../list-query.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: any = {};
  isAuthenticated = false;
  isLoginFailed = false;
  view;

  constructor(private tokenStorageService: TokenStorageService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private userListQuery: ListQuery,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
      this.isAuthenticated = this.tokenStorageService.hasTokenNonExpired();
      this.route.queryParams.subscribe(params => {
          if (params.view) {
              this.view = decodeURI(params.view);
          }
      });
  }

  onSubmit(): void {
    this.authenticationService.login(this.form).subscribe(
      dataRest => {
        this.tokenStorageService.saveToken(dataRest.accessToken);
        this.isAuthenticated = true;
        this.isLoginFailed = false;
        if (this.view) {
          this.router.navigate([this.view]);
        } else {
          this.router.navigate(['gallery']);
        }

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
