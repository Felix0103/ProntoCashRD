import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientService } from 'src/app/core/services/client.service';

@Component({
  selector: 'app-customer-search-modal',
  templateUrl: './customer-search-modal.component.html',
  styleUrls: ['./customer-search-modal.component.scss'],
  standalone: false
})
export class CustomerSearchModalComponent  implements OnInit {
  clients: any[] = [];
  searchTerm ='';
  constructor(  private modalCtrl: ModalController,
    private clientService: ClientService) { }

  ngOnInit() {
    this.clientService.getClients().subscribe((resp: any[])=> {
        this.clients = resp.filter(x=> x.active===1);
    });
  }
  close(){
     this.modalCtrl.dismiss(null);
  }
  selectCustomer(customer: any){
     this.modalCtrl.dismiss(customer);
  }
  clientFiltered() {
    return this.clients.filter(c =>
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.identification?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
