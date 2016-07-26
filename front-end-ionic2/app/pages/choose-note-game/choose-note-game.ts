import {Page, NavController, NavParams, Alert, Modal, ViewController, Events} from 'ionic-angular';
import {GamePage} from '../game/game';
import {BasePage} from '../base/base-page';
import {PreferencesPage} from '../preferences/preferences';
import {NoteLevel} from '../../providers/note-service/note-service';

@Page({
  templateUrl: 'build/pages/choose-note-game/choose-note-game.html'
})
export class ChooseNoteGamePage extends BasePage {
  public sol:boolean = true;
  public fa:boolean = false;
  public solfa:boolean = false;
  
  private delayShowAlertScore:boolean = false;
  private delayScore:any;

  constructor(public nav: NavController,
              private navParams: NavParams,
              public viewCtrl: ViewController,
              public events: Events) {
     super(nav, events);
  }
  
  onPageLoaded() {
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