import {NavController, Alert, Events} from 'ionic-angular';
import {Injectable} from '@angular/core';
import * as SockJS from 'sockjs-client';
import BaseEvent = __SockJSClient.BaseEvent;
import SockJSClass = __SockJSClient.SockJSClass;
import OpenEvent = __SockJSClient.OpenEvent;

export interface HandleMidiInputListerner {
  handleMidiInput(message:string):void;
  
}

export interface ConnectionListerner {
  onConnection():void;
  onClose():void;
}

@Injectable()
export class MidiInputService {
  
  public host:String = "localhost:8080";
  public status:String = "Disconnected";
  public count:number = -1;
  
  private client:SockJSClass;
  private mystomp:StompClient;
  autoConnect:boolean = false;
  isConnecting:boolean = false;
  
  private handleMidiInputListerner:HandleMidiInputListerner;
  private connectionListerner:ConnectionListerner;
  
  constructor(private events: Events) {
    this.count++;
  }
  
  onopen(e: OpenEvent) {
    console.log('onopen()');
  }
  
  setHandleMidiInputListerner(handleMidiInputListerner:HandleMidiInputListerner) {
    this.handleMidiInputListerner = handleMidiInputListerner;
  }
  
  setConnectionListerner(connectionListerner:ConnectionListerner) {
    this.connectionListerner = connectionListerner;
  }
  
  connect() {
    this.isConnecting = true;
    this.status = "Connecting...";
    
    let protocol:string = 'http://';
    if (this.host.startsWith(protocol)) {
      protocol = '';
    }
     
    this.client = new SockJS(protocol + this.host + '/note');
    this.mystomp = Stomp.over(this.client);
    
    this.mystomp.connect({}, (frame) => {
      this.count++;
      this.status = "Connected";
      this.notifyConnectionListerner();        
      this.mystomp.subscribe("/topic/midiinput", (message:StompFrame) => {
        this.notifyHandleMidiInputListerner(message.body);
      });
    }, () => {
      //errorCallback
      console.log('errorCallback');
    });
    this.client.onclose = (e: CloseEvent) => {
      this.isConnecting = false;
      if (e.code == 1002) {
        this.status = "Error";
        this.events.publish('midiInput:errorConnection');
      }else{
        this.events.publish('midiInput:errorConnectionGeneric');
      }
    }
  }
  
  notifyHandleMidiInputListerner(raw:string) {
    if (this.handleMidiInputListerner != null) {
      this.handleMidiInputListerner.handleMidiInput(raw);
    }
  }
  
  notifyConnectionListerner() {
    if (this.connectionListerner != null) {
      this.connectionListerner.onConnection();
    }
  }
  
}