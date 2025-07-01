import { NetworkService } from 'src/app/core/services/network.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Observable, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { LoginDTO } from '../interfaces/login-dto';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../interfaces/user-interface';
import { Storage } from '@ionic/storage-angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  myAppUrl: string;
  myApiUrl: string;
  myTokenDecoded: any;
  user!: User;
  token ="";
  constructor( private router: Router,
    private httpClient: HttpClient,
    private networkService: NetworkService,
    private storage: Storage
    ) {
    this.myAppUrl= environment.apiURL;
    this.myApiUrl ='/api/v1';
  }
  login(user: LoginDTO): Observable<any>{

    user.identifier = this.networkService.deviceInfo.identifier;
    user.platform = this.networkService.deviceInfo.platform;
    return this.httpClient.post( `${this.myAppUrl}${this.myApiUrl}/login`, user);
  }
  async setCookies(data: any){
    this.token =data.token;
    await this.storage.set('token', data.token);

    this.user = data.user;
    this.user.permissions = data.permissions;
    this.myTokenDecoded = this.getTokenDecoded();
  }
  getToken(){
    return this.token
  }
  async getTokenAsync(){
    this.token = await this.storage.get('token') ||"";
    return  this.token ;
  }


  async getUser(refresh = false){

    if(this.user && !refresh){
      return this.user;
    }else{
      let response = await firstValueFrom( this.httpClient.post<any>(`${this.myAppUrl}${this.myApiUrl}/get-user`, {token: this.getToken()} ) );
      this.user = response.user;
      this.user.permissions = response.permissions;
    }

    return this.user;
  }
  getTokenDecoded(): any{

    const helper = new JwtHelperService();
    const token = this.getToken();

    const decodedToken = helper.decodeToken(token);
    // const expirationDate = helper.getTokenExpirationDate(token);
    // const isExpired = helper.isTokenExpired(token);
    // console.log(expirationDate, isExpired);
    return decodedToken;

   /* const expirationDate = helper.getTokenExpirationDate(token);
    const isExpired = helper.isTokenExpired(token);*/

   }
  removeCookies(): void{
    this.storage.remove('token');
  }
  logout(): void{
    this.removeCookies();
    this.router.navigate(['/auth/login']);
  }

  hasPermission(permission: string){
    return this.user?.permissions?.includes(permission);
  }

}
