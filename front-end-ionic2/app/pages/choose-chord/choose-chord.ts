import {Page, NavController, NavParams, Alert, Events} from 'ionic-angular';
import {GameChordPage} from '../game-chord/game-chord';
import {BasePage} from '../base/base-page';

@Page({
  templateUrl: 'build/pages/choose-chord/choose-chord.html'
})
export class ChooseChordPage extends BasePage {


  constructor(public nav: NavController,
              private navParams: NavParams,
              public events: Events) {
    super(nav, events);
  }
  
  onPageDidEnter() {
    
  }

  goToGame() {
    //TODO: passar parâmetros se for o caso
    this.nav.push(GameChordPage);
  }
}