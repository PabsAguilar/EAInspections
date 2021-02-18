import { Pipe, PipeTransform } from "@angular/core";
import { InspectionTask } from "src/app/models/inspection-task";

@Pipe({
  name: "groupBy",
})
export class GroupByPipe implements PipeTransform {
  transform(value: any, groupByKey: string) {
    const events: any[] = [];
    const groupedElements: any = {};

    value.forEach((obj: any) => {
      if (!(obj[groupByKey] in groupedElements)) {
        groupedElements[obj[groupByKey]] = [];
      }
      groupedElements[obj[groupByKey]].push(obj);
    });

    for (let prop in groupedElements) {
      if (groupedElements.hasOwnProperty(prop)) {
        if (prop == "scheduleDay") {
          console.log("pipe scheduleDay ");
          events.push({
            key: prop,
            list: groupedElements[prop].sort(
              (a: InspectionTask, b: InspectionTask) => {
                return (
                  a.scheduleDateTime.getTime() - b.scheduleDateTime.getTime()
                );
              }
            ),
          });
        } else {
          events.push({
            key: prop,
            list: groupedElements[prop],
          });
        }
      }
    }

    return events;
  }
  private getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : 0;
  }
}
