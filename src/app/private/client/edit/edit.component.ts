import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/core/services/client.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ModalController, ToastController } from '@ionic/angular';
import { ClientLocationModalPage } from '../../modals/client-location-modal/client-location-modal.page';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  standalone: false
})
export class EditComponent  implements OnInit {
  formClient!: FormGroup;
  clientId: string;
  picture: string = '';
  picture_identification_front: string = '';
  picture_identification_back: string = '';
  constructor(   private route: ActivatedRoute,
    private clientService: ClientService,
    private fb: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {
   this.picture = '';
   this.picture_identification_back ='';
   this.picture_identification_front ='';


   this.clientId = this.route.snapshot.paramMap.get('id')!;
    this.clientService.getClientById(this.clientId).subscribe(client => {

      this.formClient = this.fb.group({
          first_name: [client.data.first_name, Validators.required],
          last_name: [client.data.last_name],
          identification: [client.data.identification, Validators.required],
          phone_number: [client.data.phone_number],
          address: [client.data.address],
          email: [client.data.email, Validators.email],
          credit_limit: [client.data.credit_limit,[Validators.required, Validators.min(0)] ],
          active: [client.data.active.toString(), Validators.required],
          picture: [''],
          picture_identification_front: [''],
          picture_identification_back: [''],
          latitude: [client.data.latitude],
          longitude: [client.data.longitude],


      });
      if(client.data.picture){
        this.picture = `${clientService.myAppUrl}/${client.data.picture}` ;
      }
      if(client.data.picture_identification_front){
        this.picture_identification_front = `${clientService.myAppUrl}/${client.data.picture_identification_front}` ;
      }
      if(client.data.picture_identification_back){
        this.picture_identification_back = `${clientService.myAppUrl}/${client.data.picture_identification_back}` ;
      }
    });
  }

  ngOnInit() {

  }
  updateClient() {
    this.clientService.updateClient(this.clientId, this.formClient.value)
      .subscribe( async () => {
         const toast = await this.toastCtrl.create({
          message: 'Cliente creado con éxito',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.router.navigate(['/clients']);
      });
  }
  async takePicture(type: 'people' | 'id_front' | 'id_back') {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera // o CameraSource.Prompt
    });

    const dataUrl = image.dataUrl!;
    if (type === 'people') {
      this.picture = dataUrl;
       this.formClient.patchValue({ picture: this.picture});
    } else if (type === 'id_front') {
      this.picture_identification_front = dataUrl;
      this.formClient.patchValue({ picture_identification_front: this.picture_identification_front});

    } else {
      this.picture_identification_back = dataUrl;
       this.formClient.patchValue({ picture_identification_back: this.picture_identification_back});

    }


  }
  async openLocationModal() {
    const modal = await this.modalCtrl.create({
      component: ClientLocationModalPage,
      componentProps: {
        latitude: this.formClient.value.latitude,
        longitude: this.formClient.value.longitude,
      }
    });

    modal.onDidDismiss().then(result => {
      if (result.data) {
        this.formClient.patchValue({
          latitude: result.data.latitude,
          longitude: result.data.longitude
        });
      }
    });

    await modal.present();
  }


  async openGoogleMaps() {
    const url = `https://www.google.com/maps/search/?api=1&query=${this.formClient.value.latitude},${this.formClient.value.longitude}`;
    await Browser.open({ url });
  }
}
