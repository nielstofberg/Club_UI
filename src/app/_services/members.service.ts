import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Member} from '../_models/member'
import { MemberType } from '../_models/membertype'
import { Rifle } from '../_models/rifle'
import { AppConfigService } from './appconfig.service';
import { Activity } from '../_models/activity';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl: string = 'http://localhost/';
  members :  Member[];

  constructor(appConfig: AppConfigService, private http: HttpClient ) {  
    this.baseUrl = appConfig.apiBaseUrl;   
  }

  looseNulls(mem: Member) : Member {
    if (mem.memberId == null) mem.memberId = 0;
    if (mem.memberNo == null) mem.memberNo = 0;
    if (mem.pin == null) mem.pin = '';
    if (mem.firstName == null) mem.firstName = '';
    if (mem.middleName == null) mem.middleName = '';
    if (mem.surname == null) mem.surname = '';
    if (mem.address == null) mem.address = '';
    if (mem.postCode == null) mem.postCode = '';
    if (mem.phoneMobile == null) mem.phoneMobile = '';
    if (mem.phoneHome == null) mem.phoneHome = '';
    if (mem.phoneWork == null) mem.phoneWork = '';
    if (mem.email == null) mem.email = '';
    if (mem.gender == null) mem.gender = '';
    //if (mem.birthday == null) mem.birthday = '';
    if (mem.picture == null) mem.picture = '';
    if (mem.keyholder == null) mem.keyholder = false;
    if (mem.facNumber == null) mem.facNumber = '';
    if (mem.notes == null) mem.notes = '';
    return mem;
  }

  getMembers() : Observable<Member[]> {
    return this.http.get<Member[]>(this.baseUrl + 'Members');
  }

  getMember(id: number) : Observable<Member> {
    return this.http.get<Member>(this.baseUrl + 'Members/' + id);
  }
  getByMemberNumber(num: number) : Observable<Member[]> {
    return this.http.get<Member[]>(this.baseUrl + 'Members?number=' + num);
  }

  updateMember(mem: Member) : Observable<Member> {
    return this.http.put<Member>(this.baseUrl + 'Members/' + mem.memberId, mem);
  }

  addMember(mem:Member) : Observable<Member> {
    return this.http.post<Member>(this.baseUrl + 'Members', mem);
  }

  getMemberTypes() : Observable<MemberType[]> {
    return this.http.get<MemberType[]>(this.baseUrl + 'MemberTypes');
  }

  getRifles(memberId: number) : Observable<Rifle[]> {
    return this.http.get<Rifle[]>(this.baseUrl + 'Rifles?ownerId=' + memberId);
  }

  updateRifle(rifle: Rifle) : Observable<Rifle> {
    return this.http.put<Rifle>(this.baseUrl + 'Rifles/' + rifle.rifleId, rifle);
  }

  addRifle(rifle: Rifle) : Observable<Rifle> {
    return this.http.post<Rifle>(this.baseUrl + 'Rifles', rifle);
  }

  deleteRifle(rifleId: number) : Observable<object> {
    return this.http.delete(this.baseUrl + 'Rifles/' + rifleId);  
  }

  getActivities() : Observable<Activity[]> {
    return this.http.get<Activity[]>(this.baseUrl + 'Activities');
  }

}
