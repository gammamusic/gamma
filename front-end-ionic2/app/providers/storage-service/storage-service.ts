import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {App, Platform, Storage, SqlStorage} from 'ionic-angular';

export class SqlStorageConstants {
    public static get G_SECONDS_BY_CHALLENGES(): any    { return {'key': "g-secondsByChallenges", 'default': '3'} };
    public static get G_NUMBER_BY_CHALLENGES(): any    { return {'key': "g-numberByChallenges", 'default': '20'} };
}

@Injectable()
export class StorageService {
  public storage: Storage = null;

  constructor(public platform: Platform) {
    this.platform.ready()
      .then(() => {
        this.storage = new Storage(SqlStorage);
      });

  }


  updatePreference(preference_name: string, preference_value: any, params?: any) {
    this.platform.ready()
      .then(() => {
        this.storage
          .get(preference_name)
          .then((data) => {
            var myData = { 'value': preference_value };
            this.storage.setJson(preference_name, myData);
          });
      });
  }

  getPreferenceOrDefault(preference_name: string, defaultValue: any, params?: any) {
    this.platform.ready()
      .then(() => {
        this.storage
          .get(preference_name)
          .then((data) => {
            var myData: any;
            if (data == null) {
              myData = defaultValue;
            } else {
              myData = JSON.parse(data).value;
            }
            params.resolve([myData]);
          });
      });
  }

  tryAddNewRecord(score, game_label, params?: any) {
    this.platform.ready()
      .then(() => {
        this.storage
          .get(game_label)
          .then((data) => {
            var newScore = { 'score': score };
            var myData: any[];
            var isRecord = true;
            if (data == null) {
              myData = [newScore];
            } else {
              myData = JSON.parse(data);
              myData.push(newScore);
              var sortedArray: any[] = myData.sort((n1, n2) => n2.score - n1.score);
              if (sortedArray.length > 5) {
                if (sortedArray[sortedArray.length - 1] == newScore) {
                  isRecord = false;
                }
                sortedArray = sortedArray.slice(0, sortedArray.length - 1);
                myData = sortedArray;
              }
            }
            this.storage.setJson(game_label, myData);
            //TODO: dizer se se trata de novo record
            params.resolve([myData, isRecord, score]);
          });
      });
  }
  
  cleanRecords() {
    this.platform.ready()
      .then(() => {
        this.storage.query("DELETE FROM KV WHERE KEY LIKE 'record-%'");
      })
  }

}

