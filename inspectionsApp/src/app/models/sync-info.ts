export class SyncInfo {
  isSync: boolean;
  syncCode: string;
  updated: boolean;
  constructor() {
    this.updated = false;
    this.isSync = false;
    this.syncCode = null;
  }
}
