import {Page, NavController, NavParams, ViewController, Events} from 'ionic-angular';
import {BasePage} from '../base/base-page';
import {ChooseGamePage} from '../choose-game/choose-game';
import {StorageService} from '../../providers/storage-service/storage-service';


@Page({
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
  
  onPageLoaded() {
    this.viewCtrl.showBackButton(false);
  }
  
  onPageWillEnter() {
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
  
  onPageDidEnter() {
    //TODO: informar que se trata de um novo record!
  }
  
              
  getScore() {
    return this.navParams.get("score");
  }
  
  goToChooseGame() {
    this.nav.setRoot(ResultPage);
    this.nav.push(ChooseGamePage);
  }
  
}
