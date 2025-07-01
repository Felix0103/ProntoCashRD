import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/core/services/app.service';

@Component({
  selector: 'app-collector-search-modal',
  templateUrl: './collector-search-modal.component.html',
  styleUrls: ['./collector-search-modal.component.scss'],
  standalone: false
})
export class CollectorSearchModalComponent  implements OnInit {

   collectors: any[] = [];
    searchTerm ='';
    constructor(  private modalCtrl: ModalController,
      private appService: AppService) { }

    ngOnInit() {
      this.appService.getAllUsers().subscribe((resp)=> {
          this.collectors =resp.data;
      });
    }
    close(){
       this.modalCtrl.dismiss(null);
    }
    selectCustomer(customer: any){
       this.modalCtrl.dismiss(customer);
    }
    collectorFiltered() {
      return this.collectors.filter(c =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

}
