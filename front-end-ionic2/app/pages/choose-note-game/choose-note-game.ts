import {Component} from '@angular/core';
import {Page, NavController, NavParams, Alert, Modal, ViewController, Events} from 'ionic-angular';
import {GamePage} from '../game/game';
import {BasePage} from '../base/base-page';
import {PreferencesPage} from '../preferences/preferences';
import {NoteLevel} from '../../providers/note-service/note-service';

@Component({
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

  goToGame(levelRaw:String) {
    var p_level:NoteLevel = NoteLevel.valueOf(levelRaw);
    
    if (p_level == NoteLevel.RightAndLeftHandPlusSeminotesLevel) {
      this.doAlert();
    } else {
      new Promise((resolve, reject) => {
        this.nav.push(GamePage, {resolve: resolve, level:p_level});
      }).then(score => {
        this.delayScore = score;
        this.delayShowAlertScore = true;
      });  
    }
  }
  
  presentFilter() {
    let modal = Modal.create(PreferencesPage);
    this.nav.present(modal);
  }
  
  doAlert() {
    let alert = Alert.create({
      title: 'Aviso!',
      subTitle: `Essa funcionalidade estará disponível em uma versão futura desse aplicativo.`,
      buttons: [
          {
              text: 'OK',
              handler: () => {
                  
              }
          }
      ]
    });
    this.nav.present(alert);
  }
}