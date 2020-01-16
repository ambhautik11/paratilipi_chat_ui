import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../model/user';
import { HttpService } from '../service/http.service';
import { Message } from '../model/message';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { UrlService } from '../service/url.service';
import { WebSocketAPI } from '../service/WebSocketAPI';
import { debug } from 'util';
import { AuthenticationService } from '../service/authentication.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  webSocketAPI: any;
  currentUser: string;
  constructor(private _snackBar: MatSnackBar, private httpService: HttpService, private urlService: UrlService, private authService: AuthenticationService) {
  }
  text: string
  user: User = new User();
  isReady = false;
  showSpinner = true;
  users = new Array();
  userChatMap: Map<string, Message[]>;
  messages: Message[] = new Array();
  title = "Select user to start conversation";
  ngOnInit() {
    this.user.user_id = this.authService.getLoggedInUser();
    this.webSocketAPI = new WebSocketAPI(this, this.urlService.baseUrl + "ws/", "/messages/" + this.user.user_id);
    this.webSocketAPI._connect();

    let listOfusers = this.httpService.getData(this.urlService.baseUrl + this.urlService.user);
    let messages = this.httpService.postData(this.urlService.baseUrl + this.urlService.messages, this.user);
    forkJoin(listOfusers, messages).pipe(map(([users, messages]) => {
      return {
        users: users,
        messages: messages
      }
    })).subscribe(responses => {

      let temp = responses.users as string[];
      temp.forEach(user => {
        if (!(user === this.user.user_id))
          this.users.push(user);
      });

      let messages = responses.messages as Message[];
      console.log(messages);
      this.userChatMap = new Map();
      this.users.forEach(user => this.userChatMap.set(user, new Array()));
      messages.forEach(message => {
        if (this.userChatMap.has(message.from_user)) {
          let temp = this.userChatMap.get(message.from_user);
          temp.push(message);
          this.userChatMap.set(message.from_user, temp);
        }
        if (this.userChatMap.has(message.to_user)) {
          let temp = this.userChatMap.get(message.to_user);
          temp.push(message);
          this.userChatMap.set(message.to_user, temp);
        }
      });
      this.currentUser = this.authService.getConvUser();
      if (this.currentUser != undefined) {
        this.openChat(this.currentUser);
      }
      console.log(this.userChatMap);
      this.isReady = true;

    }, error => {
      this.openSnackBar(error.message);
    });

    this.showSpinner = false;
  }

  openChat(user_id: string) {
    this.title = "In Conversation with " + user_id;
    this.authService.startConv(user_id);
    this.currentUser = user_id;
    this.messages = this.userChatMap.get(user_id);
  }

  handleMessage(msg: string) {
    let message: Message = <Message>JSON.parse(msg);
    console.log(message);
    this.openSnackBar("New message from : " + message.from_user);
    if (this.userChatMap.has(message.from_user)) {
      let temp = this.userChatMap.get(message.from_user);
      temp.push(message);
      this.userChatMap.set(message.from_user, temp);
    } else {
      let temp = new Array();
      temp.push(message);
      this.userChatMap.set(message.from_user, temp);
    }
  }
  disconnect() {
    this.webSocketAPI._disconnect();
  }

  sendMessage(text: string) {
    let message = new Message();
    message.from_user = this.user.user_id;
    message.to_user = this.currentUser;
    message.text = text;
    if (this.userChatMap.has(message.to_user)) {
      let temp = this.userChatMap.get(message.to_user);
      temp.push(message);
      this.userChatMap.set(message.to_user, temp);
    } else {
      let temp = new Array();
      temp.push(message);
      this.userChatMap.set(message.to_user, temp);
    }
    this.webSocketAPI._send(message);
    this.text = '';
  }
  openSnackBar(message: string) {
    this._snackBar.open(message,"",{
      duration: 2000,
    });
}
