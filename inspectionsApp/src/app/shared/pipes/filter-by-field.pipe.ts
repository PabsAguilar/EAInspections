import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterByField",
})
export class FilterByFieldPipe implements PipeTransform {
  transform(
    items: any[],
    field: string,
    value: any,
    type: string = "string"
  ): any[] {
    if (!items) return [];

    switch (type) {
      case "string":
        return items.filter(
          (it) => it[field].toLowerCase().indexOf(value.toLowerCase()) != -1
        );
        break;
      case "number":
        return items.filter((it) => it[field] == value);

      default:
        break;
    }
  }
}
