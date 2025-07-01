import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoryHelperService {
  previousUrl = '';

  constructor(private router: Router) {
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe(({urlAfterRedirects}: any ) => {
      // console.log('previous URL', this.previousUrl);
      this.previousUrl = urlAfterRedirects;
      // console.log('NEW previous URL', this.previousUrl);
    });
  }
}
