import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { LoanService } from 'src/app/core/services/loan.service';
import { CustomerSearchModalComponent } from '../../modals/customer-search-modal/customer-search-modal.component';
import { LoanTypeService } from 'src/app/core/services/loan-type.service';
import { CollectorSearchModalComponent } from '../../modals/collector-search-modal/collector-search-modal.component';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from 'src/app/core/services/client.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-loan-new',
  templateUrl: './loan-new.component.html',
  styleUrls: ['./loan-new.component.scss'],
  standalone: false
})
export class LoanNewComponent  implements OnInit {
  loanForm!: FormGroup;
  selectedCustomer: any = null;
  loanTypes: any[] =[];
  loanTypeDetails: any[] =[];
  detailSelected: any;
  date_event:any;
  selectedCollector: any = null;
  weekDays = environment.weekDays;
  chunkedWeekDays: any[] = [];

  constructor(private modalCtrl: ModalController, private loanService: LoanService,
    private cd: ChangeDetectorRef, private fb: FormBuilder, private loanTypeService: LoanTypeService,
         private toastCtrl: ToastController,
          private navCtrl: NavController, private route: ActivatedRoute, private toastrService:ToastrService,
          private clientService: ClientService, private alertController: AlertController
  ) {
        this.loanForm = this.fb.group({
          client_id: ['', Validators.required],
          loan_type_id: ['', Validators.required],
          loan_type_detail_id: ['', Validators.required],
          start_date: ['', Validators.required],
          collector_id:[],
          skip_weekdays: this.fb.array(
            this.weekDays.map(() => new FormControl(false))
          )
        });
      this.route.queryParams.subscribe(params => {
        if(params['client_id']){
          this.selectedCustomer = {id:params['client_id'], first_name:params['first_name'], last_name:params['last_name'] }
          this.loanForm.patchValue({client_id: params['client_id']});
        }

      });
  }

  ngOnInit() {


    this.loanTypeService.getLoanTypes().subscribe( (resp)=>{
      this.loanTypes =resp;
    })
    this.loanForm.get('loan_type_id')?.valueChanges.subscribe( value=> {
      this.loanForm.patchValue({loan_type_detail_id:''})
      if(value){
        this.loanTypeDetails =   this.loanTypes.find(x=> x.id === value).details;
      }else{
        this.loanTypeDetails =[];
      }
      this.detailSelected =null;
    });
    this.loanForm.get('loan_type_detail_id')?.valueChanges.subscribe( value=> {
        this.detailSelected = this.loanTypeDetails.find(x=> x.id === value);
        if(value){
          if(this.selectedCustomer && this.selectedCustomer?.credit_limit<  this.detailSelected.loan_amount ){
            this.loanForm.patchValue({loan_type_detail_id:''});
            this.detailSelected = null;
            this.toastrService.error(`Este cliente solo puede tomar prestamos de hasta ${this.selectedCustomer.credit_limit}`);
          }

          if(!this.selectedCustomer){
            this.loanForm.patchValue({loan_type_detail_id:''});
            this.detailSelected = null;
            this.toastrService.error(`Selecciona un cliente para continuar`);
          }
        }
    });
    this.chunkWeekDays();
  }
  get skipWeekdays() {
    return this.loanForm.get('skip_weekdays') as FormArray;
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
      if(this.detailSelected){
          if( this.selectedCustomer?.credit_limit<  this.detailSelected.loan_amount ){
            this.loanForm.patchValue({loan_type_detail_id:''});
            this.detailSelected = null;
            this.toastrService.error(`Este cliente solo puede tomar prestamos de hasta ${this.selectedCustomer.credit_limit}`);
          }
      }
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
  async saveLoan(){

    const resp = await firstValueFrom( this.clientService.getClientById(this.selectedCustomer.id));
    const client = resp.data;
    const loansActive  = client.loans.filter( (x:any)=> x.active ===1);

    if(loansActive.length >0){
        const alert = await this.alertController.create({
        header: `¿Crear nuevo prestamo?`,
        message: `¿Estás seguro de que deseas crear un nuevo prestamo a ${client.first_name} ${client.last_name}, este cliente tienen un prestamo activo?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: `Crear`,
            handler:  async () => {

               await this.createLoan();
            }
          }
        ]
      });

      await alert.present();
      return;
    }else{
       await this.createLoan();
    }


  }

  async createLoan(){
    const formValue = this.loanForm.value;

    const selectedDays = this.weekDays
    .filter((day, index) => formValue.skip_weekdays[index])
    .map(day => day.value);

   const payload = {
      ...formValue,
      skip_weekdays: selectedDays
    };

    this.loanService.saveLoan(payload).subscribe({
        next: async (data) => {
          const toast = await this.toastCtrl.create({
            message: 'Prestamo creado con éxito',
            duration: 2000,
            color: 'success'
          });
          toast.present();
          this.navCtrl.navigateRoot(['/loans/edit', data.data.id]);
        },
        error: async (err) => {

          const toast = await this.toastCtrl.create({
            message: 'Error al guardar el prestamo',
            duration: 2000,
            color: 'danger'
          });
          toast.present();
        }
    })
  }
}
