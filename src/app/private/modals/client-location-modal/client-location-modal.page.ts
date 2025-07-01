import { Component, Input } from '@angular/core';
import {  ModalController } from '@ionic/angular';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-client-location-modal',
  templateUrl: './client-location-modal.page.html',
  styleUrls: ['./client-location-modal.page.scss'],
  standalone: false
})
export class ClientLocationModalPage {
  @Input() latitude!: number;
  @Input() longitude!: number;

  map!: L.Map;
  marker!: L.Marker;

  constructor(private modalCtrl: ModalController, private loadingService: LoadingService) {}

  async ionViewDidEnter() {



    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
    });

    this.loadingService.show();

    let lat:number;
    let lng:number;

    if (Capacitor.isNativePlatform()) {
      // App nativa Android/iOS
      const coords = await Geolocation.getCurrentPosition();
      this.loadingService.hide();
      lat = this.latitude?? coords.coords.latitude;
      lng = this.longitude?? coords.coords.longitude;

      this.map = L.map('map').setView([lat, lng], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Leaflet',
      }).addTo(this.map);

      this.marker = L.marker([lat, lng], {
        draggable: true
      }).addTo(this.map);
        this.marker.on('dragend', () => {
            const position = this.marker.getLatLng();
            // Actualiza variables
            this.latitude = position.lat;
            this.longitude = position.lng;
          });
    } else {
      // Web puro

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          lat = this.latitude?? pos.coords.latitude;
          lng = this.longitude?? pos.coords.longitude;
          this.map = L.map('map').setView([lat, lng], 16);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Leaflet',
          }).addTo(this.map);

          this.marker = L.marker([lat, lng], {
            draggable: true
          }).addTo(this.map);
          this.loadingService.hide();
           this.marker.on('dragend', () => {
            const position = this.marker.getLatLng();
            // Actualiza variables
            this.latitude = position.lat;
            this.longitude = position.lng;
          });
        },
        (err) => {
          console.error('Error web:', err);
          this.loadingService.hide();
          return;
        }
      );
    }




  }


  save() {
    const position = this.marker.getLatLng();
    this.modalCtrl.dismiss({
      latitude: position.lat,
      longitude: position.lng
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
