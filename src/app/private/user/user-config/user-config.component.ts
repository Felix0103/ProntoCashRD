import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { Warehouse } from 'src/app/core/interfaces/warehouse';
import { AppService } from 'src/app/core/services/app.service';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss'],
  standalone: false
})
export class UserConfigComponent  implements OnInit {

  userForm: FormGroup;
  warehouses: Warehouse[] =[];

  commissionTypes = [{id:0, name:'Comision de las Ganancias'}, {id:1, name:'Comision del monto facturado'}];

  constructor( private appService: AppService,
    private fb:FormBuilder,
    private activateR: ActivatedRoute,
    private navCtrl: NavController,
    private toastrService:ToastrService, ) {

    this.userForm = this.fb.group({
      id:[0],
      first_name: [''],
      last_name: [''],
      email: [''],
      commission_percentage:[50],
      ware_house_id:[0],
      commission_type:[0]
    });

    this.activateR.paramMap.subscribe( (paramMap:ParamMap)=>{
      const id =paramMap.get('id');
      if(id){
        this.appService.getUser(Number(id)).subscribe( resp=>{

            if(resp.success && resp.data?.id){
              let data = resp.data;
              data.commission_percentage = resp.data?.user_configuration?.commission_percentage;
              data.ware_house_id = resp.data?.user_configuration?.ware_house_id;
              data.commission_type = resp.data?.user_configuration?.commission_type;
              this.userForm.patchValue(data);

            }else{
              this.toastrService.error('Este  usuario no fue encontrado', 'Usuarios');
              this.navCtrl.navigateRoot(['/user']);
            }
        });
      }else{
        this.toastrService.error('Navegación erronea', 'Usuarios');
        this.navCtrl.navigateRoot(['/user'])
      }
    });
  }

  ngOnInit() {
    this.appService.getAllWarehouse().subscribe( data=>{
      this.warehouses = data.data;
    });
  }
  update(){
    this.appService.userConfig(this.userForm.value.id, this.userForm.value).subscribe( resp =>{
      if(resp?.success){
        this.navCtrl.navigateRoot(['/user']).then( () =>{
          this.toastrService.success(resp.message, 'Usuarios');
        });
      }else{
        this.toastrService.error('Algo salió mal', 'Usuarios');
      }
     });
  }
}
