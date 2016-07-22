import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Events} from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class VersionService {
  versionDto:string;
  currentLocalVersion:string;
  constructor(private http: Http, private events: Events) {
    this.loadVersion();
  }
  
  loadVersion() {
    if (this.versionDto) {
      // already loaded data
      return Promise.resolve(this.versionDto);
    }
    
    new Promise(resolve => {
      this.http.get('/version.json')
        .map(res => res.json())
        .subscribe(data => {
          this.currentLocalVersion = data.currentLocalVersion;
          return new Promise(resolve => {
              this.http.get('https://raw.githubusercontent.com/gammamusic/dist/master/lastedversion.json')
                .map(res => res.json())
                .subscribe(data => {
                  this.versionDto = data.last;
                  resolve(this.versionDto);
                  this.checkNewVersionEvent();
                });
            });
        });
    });
  }
  
  checkNewVersionEvent() {
    if (this.versionDto != this.currentLocalVersion) {
      this.events.publish('app:newVersion');
    }
  }
}