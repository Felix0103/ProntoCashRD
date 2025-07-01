import { LoanTypeDetailModalComponent } from './../loan-type-detail-modal/loan-type-detail-modal.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { LoanTypeDetailService } from 'src/app/core/services/loan-type-detail.service';
import { LoanTypeService } from 'src/app/core/services/loan-type.service';

@Component({
  selector: 'app-loan-type-edit',
  templateUrl: './loan-type-edit.component.html',
  styleUrls: ['./loan-type-edit.component.scss'],
  standalone: false
})
export class LoanTypeEditComponent  implements OnInit {
  loanTypeForm!: FormGroup;
  loanTypeId: string;
  loanTypeDetails: any[] =[];
  newDetail = { loan_type_id: '', total_quotas: 0, loan_amount: 0,quota_amount: 0, description: '' };

  constructor(private fb: FormBuilder, private loanTypeService: LoanTypeService,
         private toastCtrl: ToastController,
          private navCtrl: NavController, private route: ActivatedRoute,
          private loanTypeDetailService: LoanTypeDetailService,
          private modalCtrl: ModalController,
          private alertController: AlertController,
        ) {

      this.loanTypeId = this.route.snapshot.paramMap.get('id')!;

        this.loanTypeService.getLoanTypeById(this.loanTypeId).subscribe(resp => {
          const loanType = resp.data;
         this.loanTypeForm = this.fb.group({
           name: [loanType.name, Validators.required],
           description: [loanType.description, Validators.required],
           min_amount: [loanType.min_amount, Validators.required],
           max_amount: [loanType.max_amount, Validators.required],
           allowed_frequencies: [loanType.allowed_frequencies, Validators.required],
           active: [loanType.active.toString(), Validators.required],
         });
          this.loanTypeDetails = loanType.details;
        });
   }

  ngOnInit() {}
  updateLoanType(){}
 async addDetail() {

 const modal = await this.modalCtrl.create({
    component: LoanTypeDetailModalComponent,
    showBackdrop: false,
    animated: false,
    componentProps: { detail: this.newDetail , loanType: this.loanTypeForm.value },
  });

  modal.present();


  const { data } = await modal.onWillDismiss();

  data.loan_type_id = this.loanTypeId;

    this.loanTypeDetailService.saveLoanTypeDetail(data).subscribe( data=> {
      this.loanTypeDetails.push(data.data);
      this.newDetail = { loan_type_id: '', total_quotas: 0, loan_amount: 0,quota_amount: 0, description: '' };
    })

  }

  async deleteDetail(detail: any) {

    const alert = await this.alertController.create({
    header: `¿Eliminar prestamo?`,
    message: `¿Estás seguro de que deseas eliminar el tipo de prestamo ${detail.loan_amount} a ${detail.total_quotas}?`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: `Eliminar`,
        handler:  async () => {

           await  this.deleteLoanDetail(detail)
        }
      }
    ]
  });

  await alert.present();

  }

  deleteLoanDetail(detail:any){
    this.loanTypeDetailService.deleteLoanTypeDetail(detail.id).subscribe( data=> {
        const loanDetail= this.loanTypeDetails.findIndex(x=> x.id === detail.id);
        this.loanTypeDetails.splice(loanDetail,1);
    })
  }
}
