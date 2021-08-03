import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Coord } from '../../interface/map';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public ionStorage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this.ionStorage = storage;
  }

  public async set(key: string, value: any) {
    await this.ionStorage?.set(key, value);
  }

  public async get(key: string) {
    return await this.ionStorage.get(key);
  }

  public async setCoord(coord: Coord) {
    await this.ionStorage.set('coord', coord);
  }

  public async getCoord(): Promise<Coord> {
    return await this.ionStorage.get('coord');
  }
}
