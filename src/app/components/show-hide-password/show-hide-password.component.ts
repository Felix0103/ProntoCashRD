import { Component, ContentChild, OnInit } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-show-hide-password',
  templateUrl: './show-hide-password.component.html',
  styleUrls: ['./show-hide-password.component.scss'],
  standalone: false
})
export class ShowHidePasswordComponent   {
  showPassword = false;

  @ContentChild(IonInput) input: IonInput | undefined;

  constructor() {

  }

  toggleShow() {
    this.showPassword = !this.showPassword;
    if(this.input){
      this.input.type = this.showPassword ? 'text' : 'password';
    }
  }

}
