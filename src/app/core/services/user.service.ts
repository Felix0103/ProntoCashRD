import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegisterDTO } from '../interfaces/register-dto';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  myAppUrl: string;
  myApiUrl: string;
  constructor( private httpClient: HttpClient) {
    this.myAppUrl= environment.apiURL;
    this.myApiUrl ='/api/v1/register';
  }

  register(register: RegisterDTO): Observable<any>{
    return this.httpClient.post( `${this.myAppUrl}${this.myApiUrl}`, register);
  }
}
