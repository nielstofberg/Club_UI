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

    EnrollStep1() : Observable<boolean> {
        return this.http.post<boolean>(this.baseUrl + 'fingerprint?step=1', null);
    }

    EnrollStep2(id : number) : Observable<boolean> {
        return this.http.post<boolean>(this.baseUrl + 'fingerprint?step=2&id='+id,null);
    }

}