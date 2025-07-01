import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, NavController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { ResponseApi } from 'src/app/core/interfaces/response-api';
import { User } from 'src/app/core/interfaces/user-interface';
import { AppService } from 'src/app/core/services/app.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
   standalone: false
})
export class UserListComponent  implements OnInit {

  items: User[] = [];
  respApi!: ResponseApi;
  hideInfiniti = true;

  constructor(private appService: AppService,
    private navCtrl: NavController,
    private toastrService:ToastrService,
  ) { }

  ngOnInit() {
    this.loadUsers(1);
  }

  private loadUsers(page: number) {

    this.appService.getUsers(page).subscribe( (resp:ResponseApi)=>{
      this.respApi =resp;
      this.items.push(...resp.data)
      this.hideInfiniti = this.respApi.current_page ===this.respApi.last_page;
    });
  }


  onIonInfinite(ev:any) {

    if( this.respApi.current_page < this.respApi.last_page ){
      this.loadUsers(this.respApi.current_page+1);

      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 2000);
    }else{
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 2000);
    }

  }

  showUser(user:User){
    this.navCtrl.navigateRoot(['user/edit',user.id]);
  }

  configUser(user:User){
    const roles = user.roles?.find(x => x.id === 2)

    if(roles){
      this.navCtrl.navigateRoot(['user/config',user.id]);
    }else{
      this.toastrService.warning("Este usuario no es un vendedor", "Usuarios");
    }

  }


}
