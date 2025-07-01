
import { LoadingService } from './../services/loading.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    private countRequest = 0;
    interval: any;
    constructor(private loadingService: LoadingService, private authService: AuthService) {
        this.countRequest =0;
     }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!this.countRequest) {
            this.loadingService.show();
            clearTimeout(this.interval);
        }
        this.countRequest++;

        return next.handle(req).pipe(
            finalize(() => {
                this.countRequest--;
                if (!this.countRequest) {
                  this.loadingService.hide();
                  this.interval = setTimeout(() => {
                    this.authService.logout();
                  },36000000 )
                }
            })
        )
    }
}
