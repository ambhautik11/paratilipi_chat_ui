import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  authenticate(username, password) {
      sessionStorage.setItem('username', username)
  }

  startConv(username){
    sessionStorage.setItem('conv_username',username)
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('username')
    console.log(!(user === null))
    return !(user === null)
  }

  logOut() {
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('conv_username')
  }

  getLoggedInUser(){
    return sessionStorage.getItem('username')
  }

  getConvUser(){
    return sessionStorage.getItem('conv_username')
  }
}