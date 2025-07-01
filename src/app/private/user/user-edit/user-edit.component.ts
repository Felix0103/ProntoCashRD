import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/core/services/app.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
   standalone: false
})
export class UserEditComponent  implements OnInit {


  checkBoxForm!: FormGroup;
  userForm: FormGroup;
  roles: any[] = [];
  user: any;
  constructor(private appService: AppService,
            private fb:FormBuilder,
            private activateR: ActivatedRoute,
            private navCtrl: NavController,
            private toastrService:ToastrService,
          ) {

    this.userForm = this.fb.group({
      id:[0],
      first_name: [''],
      last_name: [''],
      email: [''],
    });

   // this.checkBoxForm = this.fb.group({});

    this.activateR.paramMap.subscribe( (paramMap:ParamMap)=>{
      const id =paramMap.get('id');
      if(id){
        this.appService.getUser(Number(id)).subscribe( resp=>{

            if(resp.success && resp.data?.id){
              this.userForm.patchValue(resp.data)
              this.user =resp.data;

              let formControlObject:any = {};

              this.appService.getRoles().subscribe( resp => {

                this.roles = resp.data;

                this.roles.forEach(res => {
                  formControlObject[res.name] =
                    new FormControl(this.isChecked(res.name))
                });
                this.checkBoxForm = this.fb.group(formControlObject);
              });

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

  }
  update(){
     this.appService.assignPermission(this.user.id, this.checkBoxForm.value).subscribe( resp =>{
      if(resp?.success){
           this.navCtrl.navigateRoot(['/user']).then( () =>{
            this.toastrService.success(resp.message, 'Usuarios');
          });
      }else{
        this.toastrService.error('Algo salió mal', 'Usuarios');
      }
     });
  }
  isChecked(roleName: string){

    let role = this.user?.roles.find( (x:any) =>  x.name === roleName );

    return role !== undefined;
  }
}
