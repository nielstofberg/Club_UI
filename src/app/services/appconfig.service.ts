import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
  export class AppConfigService {
  
    private appConfig: any;
  
    constructor(private http: HttpClient) { }
  
    loadAppConfig() {
      return this.http.get('/assets/appconfig.json')
        .toPromise()
        .then(data => {
          this.appConfig = data;
        });
    }
  
    // This is an example property ... you can make it however you want.
    get apiBaseUrl() {
  
      if (!this.appConfig) {
        throw Error('Config file not loaded!');
      }
  
      return this.appConfig.apiBaseUrl;
    }

    get fpApiBaseUrl() {
      if (!this.appConfig) {
        throw Error('Config file not loaded!');
      }
      
      return this.appConfig.fpApiBaseUrl;
    }
  }