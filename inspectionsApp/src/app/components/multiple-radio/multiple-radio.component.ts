import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-multiple-radio",
  templateUrl: "./multiple-radio.component.html",
  styleUrls: ["./multiple-radio.component.scss"],
})
export class MultipleRadioComponent implements OnInit {
  @Input() options: any[];
  @Input() readonly: boolean = false;
  @Input()
  get data(): string[] {
    return this._selected;
  }
  set data(value: string[]) {
    if (this.options) {
      for (let index = 0; index < this.options.length; index++) {
        const element = this.options[index];
        this.options[index].checked = !value
          ? false
          : value.find((y) => y == element.value)
          ? true
          : false;
      }
    }
    if (value) {
      this._selected = value;
    } else {
      this._selected = [];
    }
  }
  @Output() dataChange: any = new EventEmitter();

  _selected: string[] = [];
  @Input() title: string = "";

  constructor() {}

  ngOnInit() {}

  onConditionChange($event, index: number) {
    var x = this.options
      .filter((item) => item.checked)
      .map((item) => {
        return item.value;
      });
    this.data = x;

    this.dataChange.emit(this._selected, true);
  }
}
