import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { LoanTypeService } from 'src/app/core/services/loan-type.service';
import { LoanService } from 'src/app/core/services/loan.service';
import { environment } from 'src/environments/environment';
import { CustomerSearchModalComponent } from '../../modals/customer-search-modal/customer-search-modal.component';
import { CollectorSearchModalComponent } from '../../modals/collector-search-modal/collector-search-modal.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loan-edit',
  templateUrl: './loan-edit.component.html',
  styleUrls: ['./loan-edit.component.scss'],
  standalone: false
})
export class LoanEditComponent  implements OnInit {

    loanForm!: FormGroup;
    canEdit = false;
    selectedCustomer: any = null;
    loanTypes: any[] =[];
    loanTypeDetails: any[] =[];
    detailSelected: any;
    date_event:any;
    selectedCollector: any = null;
    weekDays = environment.weekDays;
    chunkedWeekDays: any[] = [];
    loanId: string;
    constructor(private modalCtrl: ModalController, private loanService: LoanService,
      private cd: ChangeDetectorRef, private fb: FormBuilder, private loanTypeService: LoanTypeService,
           private toastCtrl: ToastController,
            private navCtrl: NavController,
            private route: ActivatedRoute,
    ) {

      this.loanId = this.route.snapshot.paramMap.get('id')!;
      this.loanTypeService.getLoanTypes().subscribe( (resp)=>{
          this.loanTypes =resp;

          this.loanService.getLoanById(this.loanId).subscribe( resp=>{
              this.canEdit = this.noHaveQuotaPaid(resp.data.details);
              this.selectedCustomer = resp.data.client;
              this.selectedCollector = resp.data.collector;
              this.detailSelected = resp.data.loan_type_detail;
              this.loanForm = this.fb.group({
                client_id: [resp.data.client_id, Validators.required],
                loan_type_id: [resp.data.loan_type_id, Validators.required],
                loan_type_detail_id: [resp.data.loan_type_detail_id, Validators.required],
                start_date: [resp.data.start_date, Validators.required],
                collector_id:[resp.data.collector_id],
                skip_weekdays: this.fb.array(
                  this.weekDays.map((day) => {
                   const status = resp.data.skip_weekdays.find( (val:number) =>  val === day.value)
                   return  new FormControl(status !== undefined);

                  })
                )
              });

            this.loanTypeDetails =   this.loanTypes.find(x=> x.id === resp.data.loan_type_id).details;

            this.loanForm?.get('loan_type_id')?.valueChanges.subscribe( value=> {
              this.loanForm.patchValue({loan_type_detail_id:''});
              console.log(value)
              if(value){
                this.loanTypeDetails =   this.loanTypes.find(x=> x.id === value).details;
              }else{
                this.loanTypeDetails =[];
                this.detailSelected =null;
              }
            });

            this.loanForm.get('loan_type_detail_id')?.valueChanges.subscribe( value=> {
                this.detailSelected = this.loanTypeDetails.find(x=> x.id === value);
            });

            this.chunkWeekDays();
          })
      });

      }

    ngOnInit() {


    }
    get skipWeekdays() {
      return this.loanForm?.get('skip_weekdays') as FormArray;
    }
    chunkWeekDays() {
    const chunkSize = 7;
      for (let i = 0; i < this.weekDays.length; i += chunkSize) {
        this.chunkedWeekDays.push(this.weekDays.slice(i, i + chunkSize));
      }
    }
    getSkipControl(index: number): FormControl {
      return this.skipWeekdays.at(index) as FormControl;
    }
    async openCustomerSearch() {
      const modal = await this.modalCtrl.create({
        component: CustomerSearchModalComponent,
        animated: false
      });
      await modal.present();

      const { data } = await modal.onWillDismiss();
      if (data) {
        this.selectedCustomer = data;
        this.loanForm.patchValue({ client_id: data.id });
        this.cd.detectChanges();

      }

    }
    async openCollectorSearch() {
      const modal = await this.modalCtrl.create({
        component: CollectorSearchModalComponent,
        animated: false
      });
      await modal.present();

      const { data } = await modal.onWillDismiss();
      if (data) {
        this.selectedCollector = data;
        this.loanForm.patchValue({ collector_id: data.id });
        this.cd.detectChanges();

      }

    }
    datePick(){

      this.loanForm.patchValue({start_date :this.date_event.substring(0, 10) });
    }
    saveLoan(){
      const formValue = this.loanForm.value;

      const selectedDays = this.weekDays
      .filter((day, index) => formValue.skip_weekdays[index])
      .map(day => day.value);

     const payload = {
        ...formValue,
        skip_weekdays: selectedDays
      };

      this.loanService.updateLoan(payload, this.loanId).subscribe({
          next: async (data) => {
            const toast = await this.toastCtrl.create({
              message: 'Prestamo actualizado con éxito',
              duration: 2000,
              color: 'success'
            });
            toast.present();
            this.navCtrl.navigateRoot(['/loans']);
          },
          error: async (err) => {

            const toast = await this.toastCtrl.create({
              message: 'Error al actualizar el prestamo',
              duration: 2000,
              color: 'danger'
            });
            toast.present();
          }
      })
    }
    backNoAnimation(event: Event){
       event.preventDefault(); // evita la animación por defecto
      this.navCtrl.navigateRoot(['/loans'],{ animated: false });
    }

    noHaveQuotaPaid(details: any[]): boolean{
        const exists = details.filter(x=> x.paid ===1 && x.active ===1);
        return exists.length === 0;
    }

}
