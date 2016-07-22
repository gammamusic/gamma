import {App, Platform, Storage, SqlStorage} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {ConnectMidiInputPage} from './pages/connect-midiinput/connect-midiinput';
import {PreferencesPage} from './pages/preferences/preferences';
import {MidiInputService} from './providers/midiinput-service/midiinput-service';
import {StorageService} from './providers/storage-service/storage-service';
import {VersionService} from './providers/version-service/version-service';


@App({
  template: '<ion-nav [root]="rootPage">Carregando...</ion-nav>',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/,
  providers: [MidiInputService, StorageService, VersionService]
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
