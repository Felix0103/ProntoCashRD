import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  myAppUrl: string;
  myApiUrl: string;
  constructor(private httpClient: HttpClient) {
       this.myAppUrl= environment.apiURL;
        this.myApiUrl ='/api/v1/client';
   }

    //Clientes
    getClients():Observable<any>{
      return this.httpClient.get<any>( `${this.myAppUrl}${this.myApiUrl}` );
    }
     //Clientes
    saveClient(client: any):Observable<any>{
      return this.httpClient.post<any>( `${this.myAppUrl}${this.myApiUrl}`, client );
    }
    getClientById(id: string):Observable<any>{
      return this.httpClient.get<any>( `${this.myAppUrl}${this.myApiUrl}/${id}` );
    }

    updateClient(id: string, data: any) {
      return this.httpClient.put(`${this.myAppUrl}${this.myApiUrl}/${id}`, data);
    }
    deleteClient(id: string) {
      return this.httpClient.delete(`${this.myAppUrl}${this.myApiUrl}/${id}`);
    }
}
