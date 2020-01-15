import {NgModule}  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserComponent} from './user/user.component';
import {LoginComponent} from './login/login.component';
import { LogoutComponent } from './logout.component';
import { AuthGaurdService } from './service/auth-gaurd.service';
const routes: Routes = [
  { path: 'user', component: UserComponent,canActivate:[AuthGaurdService] },
  { path: 'login', component: LoginComponent},
  { path: 'logout', component: LogoutComponent,canActivate:[AuthGaurdService] },
  {path : '', component : LoginComponent}
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }