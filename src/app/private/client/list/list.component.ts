import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { ClientService } from 'src/app/core/services/client.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: false
})
export class ListComponent  implements OnInit {


  clients: any[] = [];
  filter = '';
  isLoading = true;

  constructor(private clientService: ClientService , private navCtrl: NavController,
    private toastCtrl: ToastController, private alertController: AlertController,
     private toastrService: ToastrService, private loadingService: LoadingService) {

      this.loadingService.listenLoading().subscribe( value=>{
        this.isLoading = value;
      })
     }

  ngOnInit() {
    this.loadClients();
  }

  loadClients(event?: any) {

    this.clientService.getClients().subscribe({
      next: (data)=>{
        this.clients = data;
          this.isLoading = false;
        if (event) event.target.complete();
      },error:(err)=>{
         this.isLoading = false;
         if (event) event.target.complete();
      }
    })

  }


  clientFiltered() {
    return this.clients.filter(c =>
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(this.filter.toLowerCase()) ||
      c.identification?.toLowerCase().includes(this.filter.toLowerCase()) ||
      c.phone_number?.toLowerCase().includes(this.filter.toLowerCase())
    );
  }

  newClient() {
    this.navCtrl.navigateRoot('/clients/new');
  }
  newLoan(client: any) {
    this.navCtrl.navigateRoot(['/loans/new'], { queryParams: {
        client_id: client.id,
        first_name: client.first_name,
        last_name: client.last_name,
        credit_limit: client.credit_limit
      }
    } );
  }

  editClient(clientId: number){
    this.navCtrl.navigateRoot(['/clients/edit', clientId]);
  }
   async activeClient(client:any){

    const alert = await this.alertController.create({
    header: `¿${client.active==1?'Desactivar':'Activar'} cliente?`,
    message: `¿Estás seguro de que deseas ${client.active==1?'Desactivar':'Activar'} a ${client.first_name} ${client.last_name}?`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: `${client.active==1?'Desactivar':'Activar'}`,
        handler:  async () => {

           await  this.deleteClient(client)
        }
      }
    ]
  });

  await alert.present();

    return;
  }

  async deleteClient(client: any){
    this.clientService.deleteClient(client.id).subscribe({
              next:async (result: any) =>{
                this.toastrService.success(result.message, 'Clientes');
                this.loadClients();
              }
      });
  }
}
