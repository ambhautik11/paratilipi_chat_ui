import { Injectable } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor() { }
  baseUrl = "http://pratilipichat-env.hgpatxrquf.ap-south-1.elasticbeanstalk.com/";
  login = "login/";
  signUp = "user/";
  user = "user/";
  messages = "messages/";
  topic: "/messages/";
  webSocket: "ws/";

  loggedInUser : User;
}
