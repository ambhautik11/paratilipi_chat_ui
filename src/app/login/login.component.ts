import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material'
import { User } from '../model/user';
import { HttpService } from '../service/http.service';
import { UrlService } from '../service/url.service';
import { AuthenticationService } from '../service/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean;
  constructor(private _snackBar: MatSnackBar, private router: Router, private httpService: HttpService, private urlService: UrlService, private loginservice: AuthenticationService) { }
  username: string;
  password: string;
  showSpinner: boolean;

  ngOnInit() {
  }
  login(): void {

    // logic to login

    this.showSpinner = true;
    let user = { user_id: this.username, password: this.password };
    this.httpService.postData(this.urlService.baseUrl + this.urlService.login, user).subscribe(response => {

      if (response) {
        this.loginservice.authenticate(this.username, this.password)
        this.openSnackBar("Log in successfull !!");
        this.urlService.loggedInUser = user;
        this.router.navigate(["user"]);
        this.invalidLogin = true

      }
      else {
        this.invalidLogin = false
        this.openSnackBar("Invalid Credentials. Please try again");
      }
      this.showSpinner = false;

    }, error => {
      this.openSnackBar(error.message);

      this.showSpinner = false;
      this.invalidLogin = false

    });

  }


  signUp(): void {
    // sign up logic
    this.showSpinner = true;
    if (this.username.length < 4 || this.username.length > 32) {
      this.showSpinner = false;
      this.openSnackBar("Username must be in range of 4-32 characters")
      return;
    }

    if (this.password.length < 6 || this.password.length > 128) {
      this.showSpinner = false;
      this.openSnackBar("Password must be in range of 6-123 characters")
      return;
    }
    if (!(this.username.charAt(0) >= 'a' && this.username.charAt(0) <= 'z')
      && !(this.username.charAt(0) >= 'A' && this.username.charAt(0) <= 'Z')) {
      this.openSnackBar("Username must start with alphabet")
      this.showSpinner = false;
      return;
    }
    let flag = true;
    for (let i = 0; i < this.username.length; i++) {
      if (!((this.username.charAt(0) >= 'a' && this.username.charAt(0) <= 'z')
        || (this.username.charAt(0) >= 'A' && this.username.charAt(0) <= 'Z')
        || (this.username.charAt(i) >= '0' && this.username.charAt(i) >= '9')
        || this.username.charAt(i) == '_')) {
        this.showSpinner = false;
        flag = false
        this.openSnackBar("Username must only contain alphabets,numbers and unserscore")

        return;
      }
    }
    if (!flag)
      return;
    if (this.password.indexOf(' ') >= 0) {
      this.openSnackBar("Password cannot conatain spaces");
      this.showSpinner = false;
      return;
    }
    let user = { user_id: this.username, password: this.password };
    this.httpService.postData(this.urlService.baseUrl + this.urlService.signUp, user).subscribe(response => {
      this.showSpinner = false;
      this.openSnackBar("Successfully registered !!");
    }, error => {
      this.openSnackBar(error.message);
    });
  }
  openSnackBar(message: string) {
    this._snackBar.open(message,"",{
      duration: 2000,
    });
  }
}
