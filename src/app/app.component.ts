import { ChangeDetectorRef, Component } from '@angular/core';
import { NetworkService } from './core/services/network.service';
import { LoadingService } from './core/services/loading.service';
import { Storage } from '@ionic/storage-angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  constructor( private networkService: NetworkService, private laodingService: LoadingService,
    private storage: Storage,  private loader: NgxUiLoaderService){
    let entro = false;
    this.laodingService.listenLoading().subscribe( value=> {

      if( value){
        this.loader.start();
        entro= true;
      }
      else{
        if(entro)
        this.loader.stopAll();
      }

    })

    this.storage.create();

  }
}
