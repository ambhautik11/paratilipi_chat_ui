import { Component } from '@angular/core';
import { WebSocketAPI } from './service/WebSocketAPI';
import { HttpService } from './service/http.service';
import { User } from './model/user';
import { AuthenticationService } from './service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular8-springboot-websocket';

  webSocketAPI: WebSocketAPI;
  greeting: any;
  name: string;

  constructor(private httpService: HttpService,private loginService : AuthenticationService) { }

  ngOnInit() {
  }

  connect() {
    let user = new User();
    user.user_id = "bhauata"+ Math.random();
    user.password = "pass";
    this.httpService.postData("http://localhost:8022/login", user).subscribe(response => {
      console.log(response);
      
    });
    
    this.webSocketAPI._connect();
  }

  disconnect() {
    this.webSocketAPI._disconnect();
  }

  sendMessage() {
    this.webSocketAPI._send(this.name);
  }

  handleMessage(message) {
    this.greeting = message;
  }
}
