import {Page, NavController, Events, ViewController} from 'ionic-angular';

import {StorageService, SqlStorageConstants} from '../../providers/storage-service/storage-service';


@Page({
  templateUrl: 'build/pages/preferences/preferences.html'
})
export class PreferencesPage  {
  
  public secondsByChallenges: string;
  public numberByChallenges: string;

  constructor(private nav: NavController,
              public storageService: StorageService,
              private viewCtrl: ViewController) {
                
    new Promise((resolve, reject) => {
      var constant = SqlStorageConstants.G_SECONDS_BY_CHALLENGES;
      this.storageService.getPreferenceOrDefault(constant.key, constant.default, {resolve: resolve});
    }).then(data => {
      let zero = data[0].length == 1 ? "0" : "";
      let value = zero + data;
      this.secondsByChallenges = zero + data[0] + ":00";
    });
    
    new Promise((resolve, reject) => {
      var constant = SqlStorageConstants.G_NUMBER_BY_CHALLENGES;
      this.storageService.getPreferenceOrDefault(constant.key, constant.default, {resolve: resolve});
    }).then(data => {
      let zero = data[0].length == 1 ? "0" : "";
      let value = zero + data;
      this.numberByChallenges = "00:" + value;
    });
  }
  
  updateSecondsByChallenges(e:any) {
    let value = e.hour.text;
    this.storageService.updatePreference("g-secondsByChallenges", value);
  }
  
  updateNumberByChallenges(e:any) {
    let zero = e.minute.text.length == 1 ? "0" : "";
    let value = zero + e.minute.text;
    this.numberByChallenges = "00:" + value;
    this.storageService.updatePreference("g-numberByChallenges", value);
  }
  
  applyFilters() {
    this.viewCtrl.dismiss();
  }
}