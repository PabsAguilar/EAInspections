import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { IStorage } from "../interfaces/Istorage";
import { IStorageModel } from "../interfaces/Istorage-model";

import { Scheduling } from "../models/scheduling";
import { GenericStorageService } from "./generic-storage.service";
const SYNCSTAMPKEY = "inspection-stamp-key";
@Injectable({
  providedIn: "root",
})
export class SchedulingStorageService implements IStorage {
  constructor(private storage: Storage) {}

  collectionName: string = "scheduling-form";
  genericStorage: GenericStorageService = new GenericStorageService(
    this.collectionName,
    this.storage
  );

  add(item: Scheduling): Promise<any> {
    return this.genericStorage.add(item);
  }
  addItems(item: IStorageModel[]): Promise<any> {
    return this.genericStorage.addItems(item);
  }
  updateAll(items: IStorageModel[]): Promise<any> {
    return this.genericStorage.updateAll(items);
  }
  update(item: Scheduling): Promise<any> {
    return this.genericStorage.update(item);
  }
  getAll(): Promise<Scheduling[]> {
    return this.genericStorage.getAll();
  }
  get(id: number): Promise<Scheduling> {
    return this.genericStorage.get(id);
  }
  delete(item: any): Promise<Scheduling> {
    return this.genericStorage.delete(item);
  }

  async getPendingToSync() {
    var list = await this.getAll();
    if (list == null || list.length == 0) {
      return [];
    }

    return list.filter((x) => x.internalStatus === "Pending");
  }
}
