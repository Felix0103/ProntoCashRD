import { ChangeDetectionStrategy, Component,  EventEmitter,    Input,    Output,  } from '@angular/core';

@Component({
  selector: 'app-counter-input',
  templateUrl: './counter-input.component.html',
  styleUrls: ['./counter-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterInputComponent  {

    @Input('maximo') maximo = 99999;
    
    @Output() valueChanged = new EventEmitter<number>();
    _counterValue =1;

    get counterValue() {
      return this._counterValue;
    }

    set counterValue(val) {
      if(this.maximo > val){
        this._counterValue = val;
      }else{
        this._counterValue = parseInt(this.maximo.toString()); 
      }
  
      this.valueChanged.emit(this._counterValue)
    }

    increase() {

      if(this.maximo > this.counterValue){
        this.counterValue++;
      }
     
    }

    decrease() {

      if(   this.counterValue>1){
        this.counterValue--;
      } 
    }

 

}
