
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConnectionStatus } from '@capacitor/network';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, take } from 'rxjs';
import { PrivacyPolicyComponent } from 'src/app/components/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from 'src/app/components/terms-of-service/terms-of-service.component';
import { Language } from 'src/app/core/interfaces/language.interface';
import { RegisterDTO } from 'src/app/core/interfaces/register-dto';
import { AuthService } from 'src/app/core/services/auth.service';
import { LanguageService } from 'src/app/core/services/language.service';
import { NetworkService } from 'src/app/core/services/network.service';
import { UserService } from 'src/app/core/services/user.service';
import { PasswordValidator } from 'src/app/core/validators/password.validator';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent implements OnDestroy {

  signupForm: UntypedFormGroup;
  matching_passwords_group: UntypedFormGroup;
  appName = environment.appName;
  languages: Language[] = [];
  obs: Subscription;

  validation_messages = {
    'languageId': [
      { type: 'required', message: 'El idioma es requerido.' },
    ],
    'firstName': [
      { type: 'required', message: 'El nombre es requerido.' },
    ],
    'lastName': [
      { type: 'required', message: 'El apellido es requerido.' },
    ],
    'email': [
      { type: 'required', message: 'El correo electrónico es requerido.' },
      { type: 'pattern', message: 'Ingrese un correo valido' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 5 caracteres.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Se requiere confirmar la contraseña' }
    ],
    'matching_passwords': [
      { type: 'areNotEqual', message: 'Contraseña no coincide' }
    ]
  };

  constructor(
    public router: Router,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private menu: MenuController,
    public languageService: LanguageService,
    public networkService:NetworkService,
    private userService: UserService,
    private authService: AuthService,
    private toastrService:ToastrService,
  ) {

    this.obs =this.networkService.getStatus().subscribe();

    this.languages = this.languageService.getLanguages();
    this.matching_passwords_group = new UntypedFormGroup({
      'password': new UntypedFormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      'confirm_password': new UntypedFormControl('', Validators.required)
    }, (formGroup: any) => {
      return PasswordValidator.areNotEqual(formGroup);
    });

    this.signupForm = new UntypedFormGroup({
      'languageId': new UntypedFormControl('', Validators.required),
      'firstName': new UntypedFormControl('', Validators.required),
      'lastName': new UntypedFormControl('', Validators.required),
      'email': new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'matching_passwords': this.matching_passwords_group
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

  async showTermsModal() {
    const modal = await this.modalController.create({
      component: TermsOfServiceComponent,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  async showPrivacyModal() {
    const modal = await this.modalController.create({
      component: PrivacyPolicyComponent,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  doSignup(): void {
    let register: RegisterDTO = {
      first_name: this.signupForm.value['firstName'],
      last_name: this.signupForm.value['lastName'],
      email: this.signupForm.value['email'],
      password: this.signupForm.value.matching_passwords.password,
      language_id: this.signupForm.value['languageId'],
      identifier:this.networkService.deviceInfo.identifier,
      platform:this.networkService.deviceInfo.platform
    };

    this.userService.register(register).pipe(take(1)).subscribe({
      next: (response) => {
        this.authService.setCookies(response);
        this.router.navigate(['home']);
      },
      error:  (err:HttpErrorResponse)=>{
      //  this.toastrService.error(err.error.message,err.error.title);
      }
    });

  }


}
