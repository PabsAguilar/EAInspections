import { SyncInfo } from "./sync-info";

export class Contact {
  idContact: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  selected: boolean;
  syncInfo: SyncInfo;

  constructor() {
    this.syncInfo = new SyncInfo();
    this.selected = false;
  }
}
