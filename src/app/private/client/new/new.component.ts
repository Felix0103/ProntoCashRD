import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { AppService } from 'src/app/core/services/app.service';
import { ClientService } from 'src/app/core/services/client.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
  standalone: false
})
export class NewComponent  implements OnInit {

 formClient: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {
    this.formClient = this.fb.group({
      first_name: ['', Validators.required],
      last_name: [''],
      identification: ['', Validators.required],
      phone_number: [''],
      address: [''],
      email: ['', Validators.email],
      credit_limit: [1000.00,[Validators.required, Validators.min(0)] ],
      active: ['1', Validators.required],
    });
  }

  ngOnInit() {

  }

  async saveClient() {
    const data = this.formClient.value;



    this.clientService.saveClient(data).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Cliente creado con éxito',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.navCtrl.navigateRoot('/clients');
      },
      error: async (err) => {

        const toast = await this.toastCtrl.create({
          message: 'Error al guardar cliente',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

}
