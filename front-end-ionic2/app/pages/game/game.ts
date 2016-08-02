/// <reference path="../../../node_modules/retyped-sockjs-client-tsd-ambient/sockjs-client.d.ts" />
/// <reference path="../../../typings/modules/stomp-websocket/stomp-websocket.d.ts" />
import {Component} from '@angular/core';
import {Page, NavController, NavParams, Alert, Events} from 'ionic-angular';
import {NoteService, Note, NoteHtml, ClaveFa, ClaveSol, NoteLevel} from '../../providers/note-service/note-service';
import {MidiInputService, HandleMidiInputListerner} from '../../providers/midiinput-service/midiinput-service';
import {StorageService, SqlStorageConstants} from '../../providers/storage-service/storage-service';
import {ResultPage} from '../result/result';
import {BasePage} from '../base/base-page';
import {Observable} from 'rxjs/Rx'
import * as SockJS from 'sockjs-client';
import BaseEvent = __SockJSClient.BaseEvent;
import SockJSClass = __SockJSClient.SockJSClass;

@Component({
  templateUrl: 'build/pages/game/game.html'
})
export class GamePage extends BasePage implements HandleMidiInputListerner {

  
  public inputNotes:Note[] = [];
  public gameNotes:Note[] = [];
  public score:number = 0;
  public isChanllengeRunning:boolean = false;
  public isGameStarted = false;
  public isTutorActivate = false;
  public alertTutor:Alert;
  
  public timeRemaining:number = 0;
  public timeTotal:number = 0;
  public incremento:number = 0;
  public updateProgressBySecond:number = 5;
  public intervalValue:number = 1000 / this.updateProgressBySecond;
  public secondsToResponse:number;
  
  private timer;
  private lastNote:Note;
  private level:NoteLevel;
  
  private maxChallenges:number = 3;
  private counterChallenges:number = 0;
  
  private randomNotes:Note[] = [];
  
  
  constructor(public nav: NavController, 
              private noteService: NoteService,
              private navParams: NavParams,
              public midiInput: MidiInputService,
              public storageService: StorageService,
              public events: Events) {
                
    super(nav, events);
   
    this.listenEvents();
    this.level = navParams.get('level');
    
    this.dummyNotas();
    
    //TODO: cuidado deve ficar em um 
    if (this.level.sol) {
      this.randomNotes = this.randomNotes.concat(ClaveSol.ALL_BASIC_NOTES);
      if (this.level.semiNote) {
        this.randomNotes = this.randomNotes.concat(ClaveSol.ALL_BASIC_SEMI_NOTES);
      }
    }
    if (this.level.fa) {
      this.randomNotes = this.randomNotes.concat(ClaveFa.ALL_BASIC_NOTES);
      if (this.level.semiNote) {
        this.randomNotes = this.randomNotes.concat(ClaveFa.ALL_BASIC_SEMI_NOTES);
      }
    }    
    
    if (this.randomNotes.length <= 1 ) {
      throw new Error("Error: this.randomNotes.length <= 0!");
    }
    
    midiInput.setHandleMidiInputListerner(this);
  }
  
  listenEvents() {
    this.events.subscribe('midiInput:errorConnectionGeneric', () => {
      this.stop();
    });
  }
  
  ionViewWillLeave() {
    this.timer.unsubscribe();
  }
  onConnection() {}
  
  /**
   * Útil para renderizar notas
   */
  dummyNotas() {
    /*this.gameNotes.push(ClaveSol.CSharp);
    this.gameNotes.push(ClaveSol.DSharp);
    this.gameNotes.push(ClaveSol.FSharp);
    this.gameNotes.push(ClaveSol.GSharp);*/
  }
  
  getNextNote() {
    var temp:Note;
    do {
       temp = this.getPreviewNextNote();
    } while(temp == this.lastNote);
    this.lastNote = temp;
    return temp;
  }
  
  getPreviewNextNote() {
    var index = Math.floor(Math.random() * this.randomNotes.length);
    return this.randomNotes[index];
  }
  
  handleMidiInput(rawMidiInput:string):void {
    //TODO: verificar se o game está em execução!
    var midiinput = this.noteService.getNoteFromRawMidi(rawMidiInput);
    var note = midiinput[0];
    var keyOn = midiinput[1];
    if (keyOn) {
      if (this.isTutorActivate) {
          this.closeTutor();
          this.alertTutor.destroy();
      }else{
          this.computeNewScore(note);
      }
    }
  }
  
  match():boolean {
    //TODO: distinguir "Do" da Clave sol com a clave de "Fá"
    if (this.gameNotes.length != this.inputNotes.length) {
      return false;
    }
     
    for(let gameNote of this.gameNotes) {
      if (this.inputNotes.indexOf(gameNote) == -1) {
        return false;
      }
    }
    return true;
  }
  
  computeNewScore(note?:Note) {
    if (this.isChanllengeRunning) {
      this.isChanllengeRunning = false;
      
      if (note != null) {
        this.inputNotes.push(note);
      }
      if (this.gameNotes.length != 0) {
        let match = this.match();
        //TODO: valor do score deveria ser de acordo com o tempo gasto para respondere o tempo q teve para responder
        if (match) {
          this.score += 10;
        } else {
          this.score -= 10;
          this.showTutor();
        }
      }
      if (this.isTutorActivate == false)
        this.preparToNextGame();
    }
  }
  
  showTutor() {
    this.isTutorActivate = true;
    this.stop();
    let correct:string = this.getFormatedNotes(this.gameNotes);
    let input:string = this.getFormatedNotes(this.inputNotes);
    
    this.alertTutor = Alert.create({
      title: 'Tutor',
      subTitle: `A nota era: ${correct}<br>Você teclou: ${input}`,
      message: 'Dica: ao pressionar qualquer tecla do teclado, esta janela será automaticamente fechada.',
      buttons: [
          {
              text: 'OK',
              handler: () => {
                this.closeTutor();
              }
          }
      ]
    });
    this.nav.present(this.alertTutor);
  }
  
  closeTutor() {
    this.isTutorActivate = false;
    this.preparToNextGame();
  }
  
  getFormatedNotes(notes:Note[]) {
    let result:string = "";
    for(let note of notes) {
      let separador = "";
      if (result != "") {
        separador = ", ";
      }
      result += separador + note.baseNote.note + " (" + note.baseNote.notePt + ")";
    }
    if (result == "") result = "(nada)"; 
    return result;
  }
  
  preparToNextGame() {
    if (this.counterChallenges >= this.maxChallenges) {
      this.stop();
      this.goToResult();
      return;
    }
    
    this.gameNotes = [];
    this.gameNotes.push(this.getNextNote());
    this.inputNotes = [];
    this.counterChallenges++;
    this.reset();
  }
  
  start() {
    var p1 = new Promise((resolve, reject) => {
      var constant = SqlStorageConstants.G_SECONDS_BY_CHALLENGES;
      this.storageService.getPreferenceOrDefault(constant.key, constant.default, {resolve: resolve});
    }).then(data => {
      this.secondsToResponse = parseInt(data[0]);
      new Promise((resolve, reject) => {
        var constant = SqlStorageConstants.G_NUMBER_BY_CHALLENGES;
        this.storageService.getPreferenceOrDefault(constant.key, constant.default, {resolve: resolve});
      }).then(data => {
        this.maxChallenges = parseInt(data[0]);
        this.initTimer();
        this.isGameStarted = true;
      });
    });
  }
  
  reset() {
    if (this.timer != null) {
      this.timer.unsubscribe();
    }
    this.initTimer();
  }
  
  stop() {
    this.isChanllengeRunning = false;
    if (this.timer != null) {
      this.timer.unsubscribe();
    }
    this.cleanTimer();
  }
  
  goToResult() {
    this.nav.push(ResultPage, {score:this.score, level:this.level});    
  }
  
  cleanTimer() {
    this.timeTotal = this.intervalValue * this.updateProgressBySecond * this.secondsToResponse;
    this.timeRemaining = this.timeTotal;
    this.incremento = 0;
  }
  
  initTimer() {
    this.cleanTimer();    
    
    //TODO: this.incremento parece que não está servindo para NADA!
    this.timer = Observable
                          .interval(this.intervalValue)
                          .takeWhile(() => true)
                          .map((x) => this.incremento+this.intervalValue)
                          .subscribe((x) => {
                            this.incremento += this.intervalValue; 
                            this.timeRemaining -= this.intervalValue;
                            if (this.timeRemaining <= 0) {
                              this.incremento = 0;
                              this.timeRemaining = this.timeTotal;
                              this.computeNewScore();
                            }
                          });
    this.isChanllengeRunning = true;
  }
  
}
