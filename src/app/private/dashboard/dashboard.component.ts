import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { AppService } from 'src/app/core/services/app.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent  implements OnInit {
  canCreateInvoice = false;
  salesInfo:any;
  constructor(private authService: AuthService, private appService: AppService  ) {

    this.authService.getUser(true).then( user=> {
      if( (user?.user_configuration?.ware_house_id ??0) !==0){
         this.canCreateInvoice =true;
         this.appService.getTotalSalesToday().pipe(take(1)).subscribe( resp=>{
           this.salesInfo = resp.data;
         })
      }
   });
  }

  ngOnInit() {}


}
