import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LeadAreas } from 'src/app/models/environmental-form/lead-areas';

@Component({
  selector: 'app-areas-lead',
  templateUrl: './areas-lead.component.html',
  styleUrls: ['./areas-lead.component.scss'],
})
export class AreasLeadComponent implements OnInit {

  filledAreas: number = 0;
  isMenuOpen: boolean = false;
  progressColor: string = "danger";
  progressPercentage: number = 0;
  toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @Input() title: string = "";
  @Input()
  get model(): LeadAreas {
    return this._model;
  }
  set model(value: LeadAreas) {
    this._model = value;
  }
  _model: LeadAreas = new LeadAreas();

  @Output() modelChanged: any = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  AreaUpdated($event) {
    this.filledAreas = !this.model.leadAreas
      ? 0
      : this.model.leadAreas.filter((y) => y.sample).length;

    if (this.filledAreas >= 1 && this.model.inspectionType) {
      this.progressColor = "success";
      this.progressPercentage = 1;
      console.log(this.model);
      this.modelChanged.emit(this.model);
    }
  }

}
