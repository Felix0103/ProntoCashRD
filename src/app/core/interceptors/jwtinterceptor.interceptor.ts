import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class JWTInterceptorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token: string = this.authService.getToken();
    request.headers.append('Content-Type',  'application/json');
    let req = request;

    if(token){
      req = request.clone({
          setHeaders:{
            Authorization: `Bearer ${token}`
          },

      });
    }


    return next.handle(req).pipe(


      catchError((err: HttpErrorResponse) => {
        if(err.status === 401){
          this.authService.logout();
        }else if(err.status === 403){
          this.toastr.warning('Tu no tienes permiso para utilizar esta funcionalidad!!', 'Authorization');
        }
        else if(err.status === 500){
            console.log(err.message)
             this.toastr.error("Upss Algo salio mal, intenralo nuevamente, si el error persiste comunicate con el administrador!!", 'Error');
        }
        else if(err.status === 0){
          this.toastr.error("The backed couldn't be found!!", 'Error');
        }else if(err.status === 400 || err.status === 404){
          if(err.error?.code == 0){
            this.toastr.warning(err.error.message, 'No Found');
          }else{
            let message ='';
            Object.keys( err.error.error).forEach( (element:any) =>{
              const value = err.error.error[element];

               if(Array.isArray( value)){
                value.forEach((e:any)=>{
                  this.toastr.error(e, 'Error');
                  message += '\n'+e;
                })
              }else{
                message += '\n' + value;
                this.toastr.error(value, 'Error');
               }

            } )



          }
        }

        return throwError(err);
        //throw new Error(err.message);
        return throwError(err);
       // return throwError(err);

      } ));
  }
}
