import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { find, takeLast } from "rxjs/operators";
import { IStorage } from "../interfaces/Istorage";
import { IStorageModel } from "../interfaces/Istorage-model";
import { InspectionStatus, InspectionType } from "../models/enums";
import { InspectionTask } from "../models/inspection-task";
import { TaskSubtype } from "../models/task-subtype";
import { BitrixItestService } from "./bitrix-itest.service";
import { GenericStorageService } from "./generic-storage.service";
const SYNCSTAMPKEY = "inspection-stamp-key";
@Injectable({
  providedIn: "root",
})
export class InspectionsStorageService implements IStorage {
  constructor(private storage: Storage, private bitrix: BitrixItestService) {}

  collectionName: string = "inspections-task";
  collectionTaskSubTypesName: string = "task-itest-subtypes-list";
  genericStorage: GenericStorageService = new GenericStorageService(
    this.collectionName,
    this.storage
  );

  inspectionTypesListService = new GenericStorageService(
    this.collectionTaskSubTypesName,
    this.storage
  );

  add(item: InspectionTask): Promise<any> {
    return this.genericStorage.add(item);
  }
  addItems(item: IStorageModel[]): Promise<any> {
    return this.genericStorage.addItems(item);
  }
  update(item: InspectionTask): Promise<any> {
    return this.genericStorage.update(item);
  }
  updateAll(items: IStorageModel[]): Promise<any> {
    return this.genericStorage.updateAll(items);
  }
  getAll(): Promise<InspectionTask[]> {
    return this.genericStorage.getAll();
  }
  get(id: number): Promise<InspectionTask> {
    return this.genericStorage.get(id);
  }
  delete(item: any): Promise<InspectionTask> {
    return this.genericStorage.delete(item);
  }

  async getPendingInspections() {
    var list = await this.getAll();
    var pending;
    if (list != null) {
      pending = list
        .filter((item) => {
          return (
            item.internalStatus === InspectionStatus.New ||
            item.internalStatus === InspectionStatus.InProgress
          );
        })
        .sort(
          (a, b) =>
            this.getTime(a.scheduleDateTime) - this.getTime(b.scheduleDateTime)
        );
    }

    return pending;
  }

  async getCompletedInspections() {
    var list = await this.getAll();
    if (list != null) {
      var completed = list
        .filter((item) => {
          return item.internalStatus !== InspectionStatus.New;
        })
        .sort(
          (a, b) =>
            this.getTime(a.scheduleDateTime) - this.getTime(b.scheduleDateTime)
        );
      return completed;
    }
    return [];
  }

  private getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : 0;
  }

  async getInspectionTasksTypesList(): Promise<TaskSubtype[]> {
    var list = await this.inspectionTypesListService.getAll();

    if (list != null && list.length > 0) {
      return list;
    }
    var result = await this.bitrix.getInspectionTypes();
    list = result.result.map((x) => {
      var subType = new TaskSubtype();
      subType.id = x.ID;
      subType.blockId = x.IBLOCK_ID;
      subType.name = x.NAME;
      return subType;
    });

    this.inspectionTypesListService.addItems(list);
    return list;
  }

  async getExternal(idUser: number) {
    this.storage.set(SYNCSTAMPKEY, new Date());

    var completed = await this.getCompletedInspections();

    var list = await this.getInspectionITestJson(idUser);
    for (let index = 0; index < list.length; index++) {
      var item = list[index] as any;
      item.internalStatus = InspectionStatus.New;

      var itemCompleted = null;
      if (completed != null && completed.length > 0) {
        itemCompleted = completed.find((x) => {
          return x.id === item.id;
        });
      }

      list[index] = itemCompleted ? itemCompleted : item;
    }
    await this.genericStorage.clear();
    return this.genericStorage.addItems(list);
  }

  async getSyncStamp() {
    return await this.storage.get(SYNCSTAMPKEY);
  }

  async syncPendingTask() {
    var list = await this.getAll();
    if (list == null || list.length == 0) {
      return false;
    }
    list.forEach((element) => {
      if (element.internalStatus == InspectionStatus.Pending) {
        element.internalStatus = InspectionStatus.Completed;
      }
    });
    return await this.updateAll(list);
  }

  async getInspectionITestJson(idUser: number): Promise<InspectionTask[]> {
    try {
      var subtypes = await this.getInspectionTasksTypesList();
      var data = await this.bitrix.getInspectionsDeals(idUser);

      if (data.result.length > 0) {
        var list: InspectionTask[] = await Promise.all(
          data.result.map(
            async (x): Promise<InspectionTask> => {
              var contact = await this.bitrix.getContact(x.CONTACT_ID);
              contact = contact.result;
              var task = new InspectionTask();

              task.id = x.ID;
              task.title = x.TITLE;
              task.scheduleDateTime = x.UF_CRM_1612683055;
              task.scheduleDay = new Date(x.UF_CRM_1612683055.split("T")[0]);
              task.contactName = contact.NAME + " " + contact.LAST_NAME;
              task.serviceAddress = x.UF_CRM_1606466289;

              var address = task.serviceAddress.split("|");

              if (address.length > 1) {
                task.serviceAddress = address[0];
                task.geoPointText = address[1].replace(";", ",");
              }

              if (Array.isArray(contact.PHONE) && contact.PHONE.length) {
                task.contactPhone = contact.PHONE[0].VALUE;
              }

              if (Array.isArray(contact.EMAIL) && contact.EMAIL.length) {
                task.contactEmail = contact.EMAIL[0].VALUE;
              }

              if (
                Array.isArray(x.UF_CRM_1612691326) &&
                x.UF_CRM_1612691326.length
              ) {
                await Promise.all(
                  x.UF_CRM_1612691326.map(async (element: string) => {
                    if (element.includes("C_")) {
                      var contactReference = await this.bitrix.getContact(
                        Number.parseInt(element.split("C_")[1])
                      );
                      if (contactReference && contactReference.result) {
                        contactReference = contactReference.result;
                        task.referalPartnerContact =
                          contactReference.NAME +
                          " " +
                          contactReference.LAST_NAME;
                      }
                    }
                    if (element.includes("CO_")) {
                      var companyReference = await this.bitrix.getCompanyContact(
                        Number.parseInt(element.split("CO_")[1])
                      );
                      if (companyReference && companyReference.result) {
                        task.referalPartnerCompany =
                          companyReference.result.TITLE;
                      }
                    }
                  })
                );
              }

              task.inspectorUserId = x.UF_CRM_1612682994;
              task.inspectionType = InspectionType.Environmental;
              task.inspectionSubTypes = x.UF_CRM_1612433280.map((m) => {
                return subtypes.find((y) => y.id == m);
              });
              task.inspectionSubTypesString = task.inspectionSubTypes
                .map((type) => {
                  return type.name;
                })
                .join(",");
              task.inspectionsInstructions = x.UF_CRM_1612683023;
              task.internalStatus = InspectionStatus.New;

              return Promise.resolve(task);
            }
          )
        );

        return list;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }
}
