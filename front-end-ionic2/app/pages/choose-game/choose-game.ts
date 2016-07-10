import {Page, NavController, NavParams, Alert, Modal, ViewController} from 'ionic-angular';
import {GamePage} from '../game/game';
import {PreferencesPage} from '../preferences/preferences';
import {NoteLevel} from '../../providers/note-service/note-service';

@Page({
  templateUrl: 'build/pages/choose-game/choose-game.html'
})
export class ChooseGamePage {
  public sol:boolean = true;
  public fa:boolean = false;
  public solfa:boolean = false;
  
  private delayShowAlertScore:boolean = false;
  private delayScore:any;

  constructor(private nav: NavController,
              private navParams: NavParams,
              public viewCtrl: ViewController) {
                
    
  }
  
  onPageLoaded() {
    this.viewCtrl.showBackButton(false);
  }
  
  onPageDidEnter() {
    if (this.delayShowAlertScore) {
      this.showAlertScore();
    }
    this.delayShowAlertScore = false;
  }

  goToGame(levelRaw:String) {
    var p_level:NoteLevel = NoteLevel.valueOf(levelRaw);
    
    new Promise((resolve, reject) => {
      this.nav.push(GamePage, {resolve: resolve, level:p_level});
    }).then(score => {
      this.delayScore = score;
      this.delayShowAlertScore = true;
    });
  }
  
  presentFilter() {
    let modal = Modal.create(PreferencesPage);
    this.nav.present(modal);
  }
  
  
  //TODO: esse método faz sentido?
  showAlertScore() {
    let alert = Alert.create({
      title: 'Pontuação',
      subTitle: 'Sua pontuação: ' +this.delayScore,
      buttons: [{text: 'OK' }]
      
    });
    this.nav.present(alert);
  }
}