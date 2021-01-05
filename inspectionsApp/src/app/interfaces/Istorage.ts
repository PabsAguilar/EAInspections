import { IStorageModel } from "./Istorage-model";

export interface IStorage {
  collectionName: string;
  add(item: IStorageModel): Promise<any>;
  addItems(item: IStorageModel[]): Promise<any>;
  update(item: IStorageModel): Promise<any>;
  getAll(): Promise<IStorageModel[]>;
  get(id: number): Promise<IStorageModel>;
  delete(item: IStorageModel): Promise<any>;
}
