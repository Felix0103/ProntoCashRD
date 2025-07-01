import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoanTypeService } from 'src/app/core/services/loan-type.service';

@Component({
  selector: 'app-loan-type-list',
  templateUrl: './loan-type-list.component.html',
  styleUrls: ['./loan-type-list.component.scss'],
  standalone: false
})
export class LoanTypeListComponent  implements OnInit {

  loanTypes: any[] = [];
  filter = '';
  isLoading = true;
  constructor(private loanTypeService: LoanTypeService, private navCtrl: NavController,) { }

  ngOnInit() {
    this.loadLoanTypes();
  }

  loadLoanTypes(event?: any) {

      this.loanTypeService.getLoanTypes().subscribe({
        next: (data)=>{
          this.loanTypes = data;
            this.isLoading = false;
          if (event) event.target.complete();
        },error:(err)=>{
           this.isLoading = false;
           if (event) event.target.complete();
        }
      });

  }
  loanTypeFiltered() {
    return this.loanTypes.filter(c =>
      `${c.name}`.toLowerCase().includes(this.filter.toLowerCase()) ||
      c.description?.toLowerCase().includes(this.filter.toLowerCase())
    );
  }
  newLoanType() {
    this.navCtrl.navigateRoot('/loan-types/new');
  }
  editLoanType(loanTypeId: number){
    this.navCtrl.navigateRoot(['/loan-types/edit', loanTypeId]);
  }

}
