import {Component} from '@angular/core';
import {Page, NavController, NavParams, ViewController, Toast, Events, Alert} from 'ionic-angular';
import {AfterViewInit, ViewChild, Renderer, ElementRef} from '@angular/core' 
import {TrainingChoosePage} from '../training-choose/training-choose';
import {MyApp} from '../../app';
import {ChooseChordPage} from '../choose-chord/choose-chord';
import {MidiInputService} from '../../providers/midiinput-service/midiinput-service';
import {VersionService} from '../../providers/version-service/version-service';
import {ConnectionListerner} from '../../providers/midiinput-service/midiinput-service';
import {Router} from '@angular/router';
import {ChartComponent, Chart} from 'ng2-chartjs2';

@Component({
  templateUrl: 'build/pages/connect-midiinput/connect-midiinput.html',
  directives: [ChartComponent]
})
export class ConnectMidiInputPage implements ConnectionListerner, AfterViewInit {
  
  labels: string[] = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
  data: Chart.Dataset[] = [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3]
    }
  ];
  
  @ViewChild('buttonConnect') button: ElementRef;
  
  newVersion:boolean = false;
  
  constructor(private nav: NavController,
              public midiInput: MidiInputService,
              private renderer: Renderer,
              public versionService:VersionService,
              private events: Events,
              public viewCtrl: ViewController,
              public navParams: NavParams) {
    this.listenEvents();
    midiInput.setConnectionListerner(this);
    midiInput.host = window.location.host;
  }
  
  ionViewLoaded() {
    this.viewCtrl.showBackButton(false);
    
    
  }
  
  ionViewDidEnter() {
    if (this.navParams.get("errorConnectionGeneric")) {
      let alert = Alert.create({
        title: 'Error!',
        subTitle: `A conexão com o servidor foi perdida! Tente conectar novamente.`,
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
  
  listenEvents() {
    this.events.subscribe('app:newVersion', () => {
      this.newVersion = true;
    });
    
    this.events.subscribe('midiInput:errorConnection', () => {
      this.doAlertFailed();
    });
  }
  
  doAlertFailed() {
    let alert = Alert.create({
      title: 'Error!',
      subTitle: `Não foi possível conectar ao servidor!`,
      buttons: ['OK']
    });
    this.nav.present(alert);
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
    this.midiInput.connect();
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
    this.nav.push(TrainingChoosePage);
  }
}