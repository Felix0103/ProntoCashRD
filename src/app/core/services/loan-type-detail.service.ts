import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoanTypeDetailService {

 myAppUrl: string;
  myApiUrl: string;
  constructor(private httpClient: HttpClient  ) {
       this.myAppUrl= environment.apiURL;
        this.myApiUrl ='/api/v1/loan-types-details';
   }

    saveLoanTypeDetail(loanTypeDetail: any):Observable<any>{
      return this.httpClient.post<any>( `${this.myAppUrl}${this.myApiUrl}`, loanTypeDetail );
    }

    updateLoanTypeDetail(id: string, data: any) {
      return this.httpClient.put(`${this.myAppUrl}${this.myApiUrl}/${id}`, data);
    }
    deleteLoanTypeDetail(id: string) {
      return this.httpClient.delete(`${this.myAppUrl}${this.myApiUrl}/${id}`);
    }
}
