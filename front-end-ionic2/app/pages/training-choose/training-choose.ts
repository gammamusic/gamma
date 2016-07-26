import {Page, NavController, NavParams, Alert, Modal, ViewController, Events} from 'ionic-angular';
import {ChooseNoteGamePage} from '../choose-note-game/choose-note-game';
import {BasePage} from '../base/base-page';
import {PreferencesPage} from '../preferences/preferences';
import {NoteLevel} from '../../providers/note-service/note-service';

@Page({
  templateUrl: 'build/pages/training-choose/training-choose.html'
})
export class TrainingChoosePage extends BasePage {

  constructor(public nav: NavController,
              private navParams: NavParams,
              public viewCtrl: ViewController,
              public events: Events) {
     super(nav, events);
  }
  
  onPageLoaded() {
    this.viewCtrl.showBackButton(false);
  }
  
  onPageDidEnter() {
  }

  goToGameNote() {
    this.nav.push(ChooseNoteGamePage);
  }
  
  goToGameChord() {
    this.doAlert();
  }
  
  goToRecords() {
    this.doAlert();
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
  
  presentFilter() {
    let modal = Modal.create(PreferencesPage);
    this.nav.present(modal);
  }
  
}