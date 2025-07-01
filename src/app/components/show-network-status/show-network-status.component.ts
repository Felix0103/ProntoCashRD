import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-network-status',
  templateUrl: './show-network-status.component.html',
  styleUrls: ['./show-network-status.component.scss'],
  standalone: false
})
export class ShowNetworkStatusComponent  implements OnInit {

  @Input() conected = false;

  constructor() { }

  ngOnInit() {}

}
