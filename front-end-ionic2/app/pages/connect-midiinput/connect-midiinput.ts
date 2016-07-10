import {Page, NavController, NavParams, ViewController} from 'ionic-angular';
import {AfterViewInit, ViewChild, Renderer, ElementRef} from '@angular/core' 
import {ChooseGamePage} from '../choose-game/choose-game';
import {MyApp} from '../../app';
import {ChooseChordPage} from '../choose-chord/choose-chord';
import {MidiInputService} from '../../providers/midiinput-service/midiinput-service';
import {ConnectionListerner} from '../../providers/midiinput-service/midiinput-service';
import {Router} from '@angular/router';

@Page({
  templateUrl: 'build/pages/connect-midiinput/connect-midiinput.html'
})
export class ConnectMidiInputPage implements ConnectionListerner, AfterViewInit {
  
  @ViewChild('buttonConnect') button: ElementRef;
  
  constructor(private nav: NavController,
              public midiInput: MidiInputService,
              private renderer: Renderer) {
    console.log(`${midiInput.autoConnect}`);
    midiInput.setConnectionListerner(this);
    midiInput.host = window.location.host; 
  }
  
  ngAfterViewInit() {
    //TODO: Não funcionou! Pesquisar melhor
    /*if (document.referrer.endsWith('autoConnectRedirect.html')) {
      let event = new MouseEvent('click', {bubbles:true});
      this.renderer.invokeElementMethod(this.button.nativeElement, 'dispatchEvent', [event]);
    }*/
  }
  
  autoConnect() {
    if (this.midiInput.autoConnect) {
      this.startConnection();
    }
  }
  
  startConnection() {
    console.log("startConnection - init");
    this.midiInput.connect();
    console.log("startConnection - fim");
  }
  
  onConnection() {
    //this.goToChooseChordGame();
    this. goToChooseGame();
  }
  
  onClose() {}
  
  goToChooseChordGame() {
    this.nav.push(ChooseChordPage);
  }
  
  goToChooseGame() {
    this.nav.push(ChooseGamePage);
  }
}