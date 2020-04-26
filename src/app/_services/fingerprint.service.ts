import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './appconfig.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'  
})
export class FingerprintService {
    baseUrl: string = 'http://localhost/';

    constructor(appConfig: AppConfigService, private http: HttpClient) { 
        this.baseUrl = appConfig.fpApiBaseUrl;
    }

    ReadFp() : Observable<object[]> {
        return this.http.get<object[]>(this.baseUrl + 'fingerprint');
    }
}