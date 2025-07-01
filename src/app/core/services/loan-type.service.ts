import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoanTypeService {

 myAppUrl: string;
  myApiUrl: string;
  constructor(private httpClient: HttpClient  ) {
       this.myAppUrl= environment.apiURL;
        this.myApiUrl ='/api/v1/loan-types';
   }

    getLoanTypes():Observable<any>{
      return this.httpClient.get<any>( `${this.myAppUrl}${this.myApiUrl}` );
    }
    saveLoanType(loanType: any):Observable<any>{
      return this.httpClient.post<any>( `${this.myAppUrl}${this.myApiUrl}`, loanType );
    }
    getLoanTypeById(id: string):Observable<any>{
      return this.httpClient.get<any>( `${this.myAppUrl}${this.myApiUrl}/${id}` );
    }

    updateLoanType(id: string, data: any) {
      return this.httpClient.put(`${this.myAppUrl}${this.myApiUrl}/${id}`, data);
    }
    deleteLoanType(id: string) {
      return this.httpClient.delete(`${this.myAppUrl}${this.myApiUrl}/${id}`);
    }
}
