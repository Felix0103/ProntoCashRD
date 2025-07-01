import { NetworkService } from './../../../core/services/network.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from './../../../../environments/environment';
import { Component, OnDestroy } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription, catchError, take } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnDestroy{

  environment = environment
  loginForm: UntypedFormGroup;
  obs: Subscription;
  conected = false;
  hideStatus = false;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Correo electrónico es requerido.' },
      { type: 'pattern', message: 'Ingrese un Correo electrónico valido.' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es requrida.' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 5 caracteres.' }
    ]
  };

  constructor(
    public router: Router,
    public menu: MenuController,
    public authService: AuthService,
    private toastrService:ToastrService,
    public networkService:NetworkService
  ) {
    this.obs = this.networkService.getStatus().subscribe(data=>{
      this.conected = data.connected;
      this.hideStatus = false;
      if(data.connected){
        setTimeout(() => {
          this.hideStatus = true;
        }, 5000);
      }
    });

    this.loginForm = new UntypedFormGroup({
      'email': new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new UntypedFormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ]))
    });
  }
  ngOnDestroy(): void {
    this.obs.unsubscribe();
  }

  // Disable side menu for this page
  ionViewDidEnter(): void {
    this.menu.enable(false);
  }

  // Restore to default when leaving this page
  ionViewDidLeave(): void {
    this.menu.enable(true);
  }

  doLogin(): void {


    try {
      this.authService.login(this.loginForm.value).pipe(take(1)).subscribe({
        next:(value) =>{
           this.authService.setCookies(value).then(()=>{
                this.router.navigate(['home']);
            });
        },
        error:(err:HttpErrorResponse)=>{
          this.toastrService.error(err.error.message,err.error.title);
        }
      });
    } catch (error) {

    }

  }



}
