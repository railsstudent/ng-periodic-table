import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-atom',
  templateUrl: './atom.component.html',
  styleUrls: ['./atom.component.scss']
})
export class AtomComponent implements OnInit {

  @Input()
  data: any;

  constructor() { }

  ngOnInit() {
  }

}
