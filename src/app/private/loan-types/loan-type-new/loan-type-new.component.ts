import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { LoanTypeService } from 'src/app/core/services/loan-type.service';

@Component({
  selector: 'app-loan-type-new',
  templateUrl: './loan-type-new.component.html',
  styleUrls: ['./loan-type-new.component.scss'],
  standalone: false
})
export class LoanTypeNewComponent  implements OnInit {
  loanTypeForm: FormGroup;
  constructor(  private fb: FormBuilder, private loanTypeService: LoanTypeService,
       private toastCtrl: ToastController,
        private navCtrl: NavController
  ) {
    this.loanTypeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      min_amount: ['', Validators.required],
      max_amount: ['', Validators.required],
      allowed_frequencies: [[], Validators.required],
      active: ['1', Validators.required],
    });
  }

  ngOnInit() {}
  saveLoanType(){

    const data = this.loanTypeForm.value;

    this.loanTypeService.saveLoanType(data).subscribe({
      next: async (data) => {
        const toast = await this.toastCtrl.create({
          message: 'Tipo de prestamo creado con éxito',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.navCtrl.navigateRoot(['/loan-types/edit', data.data.id]);
      },
      error: async (err) => {

        const toast = await this.toastCtrl.create({
          message: 'Error al guardar el tipo de prestamo',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}
