import { Injectable } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { BehaviorSubject, Observable } from 'rxjs';
import { Device } from '@capacitor/device';
import { DeviceInfo } from '../interfaces/device-info-interface';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  deviceInfo!: DeviceInfo;

  conectionStatus = new BehaviorSubject<ConnectionStatus>({ connected: false, connectionType: 'none'}) ;

  constructor(){


    Network.getStatus().then((value=>{
      this.conectionStatus.next( value);
    }));

    Network.addListener('networkStatusChange', (val)=>{
      Network.getStatus().then((value=>{
        this.conectionStatus.next( value);
      }));
    });
    this.getInfoDevice().then( info => this.deviceInfo = info)
  }

  getStatus(){
    return this.conectionStatus.asObservable();
  }
  async getInfoDevice(): Promise<DeviceInfo>{
    let {platform} = await Device.getInfo();
    let {identifier} = await Device.getId();

    return {platform, identifier};

  }
}
