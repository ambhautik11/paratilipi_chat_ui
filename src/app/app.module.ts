import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CustomMaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component'
import { LogoutComponent } from './logout.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    LogoutComponent 
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CustomMaterialModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule
     
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
