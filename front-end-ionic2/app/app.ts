import {Component} from '@angular/core';
import {App, Platform, ionicBootstrap, Storage, SqlStorage} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {ConnectMidiInputPage} from './pages/connect-midiinput/connect-midiinput';
import {PreferencesPage} from './pages/preferences/preferences';
import {MidiInputService} from './providers/midiinput-service/midiinput-service';
import {StorageService} from './providers/storage-service/storage-service';
import {VersionService} from './providers/version-service/version-service';
import {NoteService} from './providers/note-service/note-service';

@Component({
  templateUrl: 'build/app.html'
})
export class MyApp {
  //rootPage: any = HomePage;
  rootPage: any = ConnectMidiInputPage;
  //rootPage: any = PreferencesPage;

  constructor(platform: Platform, midiInputService:MidiInputService) {
    if (document.referrer.endsWith('autoConnectRedirect.html')) {
      midiInputService.autoConnect = true;
    }
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

// Pass the main app component as the first argument
// Pass any providers for your app in the second argument
// Set any config for your app as the third argument:
// http://ionicframework.com/docs/v2/api/config/Config/

ionicBootstrap(MyApp, [MidiInputService, StorageService, VersionService, NoteService], {
  tabbarPlacement: 'bottom'
});