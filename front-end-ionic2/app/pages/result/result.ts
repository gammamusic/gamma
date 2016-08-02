import {Component} from '@angular/core';
import {Page, NavController, NavParams, ViewController, Events} from 'ionic-angular';
import {BasePage} from '../base/base-page';
import {TrainingChoosePage} from '../training-choose/training-choose';
import {StorageService} from '../../providers/storage-service/storage-service';


@Component({
  templateUrl: 'build/pages/result/result.html',
})
export class ResultPage extends BasePage {
  public records;
  public isRecord : boolean = false; 
  constructor(public nav: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public storageService: StorageService,
              public events: Events) {
    super(nav, events);
  }
  
  ionViewLoaded() {
    this.viewCtrl.showBackButton(false);
  }
  
  ionViewWillEnter() {
    new Promise((resolve, reject) => {
      //TODO: setar corretamente a chave
      this.storageService.tryAddNewRecord(this.navParams.get("score"), 
        "record-note-" + this.navParams.get("level").id, 
        {resolve: resolve});
    }).then(data => {
      this.records =  data[0];
      this.isRecord = data[1];
    });
  }
  
  ionViewDidEnter() {
    //TODO: informar que se trata de um novo record!
  }
  
              
  getScore() {
    return this.navParams.get("score");
  }
  
  goToChooseGame() {
    this.nav.setRoot(ResultPage);
    this.nav.push(TrainingChoosePage);
  }
  
}
