import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { find, takeLast } from "rxjs/operators";
import { IStorage } from "../interfaces/Istorage";
import { IStorageModel } from "../interfaces/Istorage-model";
import { DamageInspection } from "../models/damage-inspection";

import {
  AreaConditionType,
  bitrixMappingEnvironmental,
  DamageAreaType,
  InspectionStatus,
  InspectionType,
} from "../models/enums";
import { EnvironmentalForm } from "../models/environmental-form";
import { Sample } from "../models/environmental-form/sample";
import { InspectionTask } from "../models/inspection-task";
import { TaskSubtype } from "../models/task-subtype";
import { User } from "../models/user";
import { BitrixItestService } from "./bitrix-itest.service";
import { GenericStorageService } from "./generic-storage.service";
const SYNCSTAMPKEY = "inspection-stamp-key";
@Injectable({
  providedIn: "root",
})
export class InspectionsStorageService {
  constructor(private storage: Storage) {}

  collectionName: string = "inspections-task";
  inspectionStore: GenericStorageService = new GenericStorageService(
    this.collectionName,
    this.storage
  );

  add(item: any): Promise<any> {
    return this.inspectionStore.complexAdd(item);
  }
  addItems(item: IStorageModel[]): Promise<any> {
    return this.inspectionStore.complexAddItems(item);
  }
  update(item: InspectionTask): Promise<any> {
    return this.inspectionStore.complexUpdate(item);
  }
  // updateAll(items: IStorageModel[]): Promise<any> {
  //   return this.inspectionStore.updateAll(items);
  // }
  getAll(): Promise<InspectionTask[]> {
    return this.inspectionStore.complexGetAll();
  }
  get(id: number, enterprise: string = null): Promise<InspectionTask> {
    return this.inspectionStore.complexGet(id, enterprise);
  }
  delete(item: any): Promise<InspectionTask> {
    return this.inspectionStore.complexDelete(item);
  }

  clear(): Promise<boolean> {
    return this.inspectionStore.complexClear();
  }

  async getPendingToSync(user: User) {
    var list = await this.getAll();
    if (list == null || list.length == 0) {
      return [];
    }

    return list.filter(
      (x) =>
        user.enterprise == x.enterprise &&
        (x.internalStatus === InspectionStatus.PendingSaved ||
          x.internalStatus === InspectionStatus.PendingSentLab ||
          x.internalStatus === InspectionStatus.PendingToComplete)
    );
  }
}
