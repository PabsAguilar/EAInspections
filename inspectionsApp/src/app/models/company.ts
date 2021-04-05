import { SyncInfo } from "./sync-info";

export class Company {
  id: string;
  title: string;
  type: string;
  phone: string;
  email: string;
  selected: boolean;
  syncInfo: SyncInfo;

  constructor() {
    this.syncInfo = new SyncInfo();
  }
}
