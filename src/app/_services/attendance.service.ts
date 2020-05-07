import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './appconfig.service';
import { Observable } from 'rxjs';
import { Attendance } from '../_models';

@Injectable({
    providedIn: 'root'
  })
export class AttendanceService {
    baseUrl: string = 'http://localhost/';

    constructor(appConfig: AppConfigService, private http: HttpClient ) {  
        this.baseUrl = appConfig.apiBaseUrl;   
    }

    getAll() : Observable<Attendance[]> {
        return this.http.get<Attendance[]>(this.baseUrl + "attendances")
    }

    getByMember(memid: number) : Observable<Attendance[]> {
        return this.http.get<Attendance[]>(this.baseUrl + "attendances?member=" + memid);
    }

    add(attendance: Attendance) : Observable<Attendance> {
        return this.http.post<Attendance>(this.baseUrl + "attendances", attendance);
    }

}