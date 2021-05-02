import { IStorageModel } from "./Istorage-model";

export interface IStorage {
  collectionName: string;
  add(item: IStorageModel): Promise<any>;
  addItems(item: IStorageModel[]): Promise<any>;
  update(item: IStorageModel): Promise<any>;
  getAll(enterpise: string): Promise<IStorageModel[]>;
  get(id: number, enterpise: string): Promise<IStorageModel>;
  delete(item: IStorageModel): Promise<any>;
}
