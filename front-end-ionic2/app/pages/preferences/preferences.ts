import {Page, NavController, Events} from 'ionic-angular';

import {StorageService} from '../../providers/storage-service/storage-service';


@Page({
  templateUrl: 'build/pages/preferences/preferences.html'
})
export class PreferencesPage  {
  
  public secondsByChallenges: string;
  public numberByChallenges: string;

  constructor(private nav: NavController,
              public storageService: StorageService) {
                
    new Promise((resolve, reject) => {
      this.storageService.getPreferenceOrDefault("g-secondsByChallenges", "3", {resolve: resolve});
    }).then(data => {
      this.secondsByChallenges = "0" + data[0] + ":00";
    });
    
    new Promise((resolve, reject) => {
      this.storageService.getPreferenceOrDefault("g-numberByChallenges", "20", {resolve: resolve});
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
}