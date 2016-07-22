import {Page, NavController, NavParams, ViewController, Toast, Events, Alert} from 'ionic-angular';
import {ConnectMidiInputPage} from '../connect-midiinput/connect-midiinput';

export class BasePage {
  
  constructor(public nav: NavController,
              public events: Events) {
    this.listenEvents();
  }
  
  listenEvents() {
    this.events.subscribe('midiInput:errorConnectionGeneric', () => {
      this.doAlertFailed();
    });
  }
  
  doAlertFailed() {
    this.nav.push(ConnectMidiInputPage, {errorConnectionGeneric:true});
  }
    
}