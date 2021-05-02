import { Injectable } from "@angular/core";
import { IStorage } from "../interfaces/Istorage";
import { IonicStorageModule, Storage } from "@ionic/storage";
import { IStorageModel } from "../interfaces/Istorage-model";

@Injectable({
  providedIn: "root",
})
export class GenericStorageService implements IStorage {
  constructor(collectionName: string, private storage: Storage) {
    this.collectionName = collectionName;
  }

  collectionName: string;
  add(item: IStorageModel): Promise<any> {
    return this.storage.get(this.collectionName).then((items) => {
      if (items) {
        items.push(item);
        return this.storage.set(this.collectionName, items);
      } else {
        return this.storage.set(this.collectionName, [item]);
      }
    });
  }

  addItems(newItems): Promise<any> {
    return this.storage.get(this.collectionName).then((items) => {
      if (items) {
        items = items.concat(newItems);
        return this.storage.set(this.collectionName, items);
      } else {
        return this.storage.set(this.collectionName, newItems);
      }
    });
  }

  update(item: IStorageModel): Promise<any> {
    return this.storage.get(this.collectionName).then((items) => {
      if (!items || items.length === 0) {
        return null;
      }
      let newItems = [];
      for (let i of items) {
        if (
          i.id === item.id &&
          (item.enterprise == null || item.enterprise == i.enterprise)
        ) {
          newItems.push(item);
        } else {
          newItems.push(i);
        }
      }

      return this.storage.set(this.collectionName, newItems);
    });
  }

  updateAll(items: IStorageModel[]) {
    return this.storage.set(this.collectionName, items);
  }

  getAll(enterprise: string = null): Promise<any> {
    return this.storage
      .get(this.collectionName)
      .then((items: IStorageModel[]) => {
        if (!items || items.length === 0) {
          return [];
        }

        return items.filter(
          (x) => enterprise == null || enterprise == x.enterprise
        );
      });
  }
  get(id: number, enterprise: string = null): Promise<any> {
    return this.storage
      .get(this.collectionName)
      .then((items: IStorageModel[]) => {
        if (!items || items.length === 0) {
          return null;
        }

        for (let i of items) {
          if (
            i.id === id &&
            (enterprise == null || enterprise == i.enterprise)
          ) {
            return i;
          }
        }
      });
  }
  delete(item: IStorageModel): Promise<any> {
    return this.storage.get(this.collectionName).then((items) => {
      if (!items || items.length === 0) {
        return null;
      }
      let keepItems = [];
      for (let i of items) {
        if (
          i.id !== item.id &&
          (item.enterprise == null || item.enterprise == i.enterpise)
        ) {
          keepItems.push(item);
        }
      }
      return this.storage.set(this.collectionName, keepItems);
    });
  }
  clear(): Promise<any> {
    return this.storage.set(this.collectionName, null);
  }
}
