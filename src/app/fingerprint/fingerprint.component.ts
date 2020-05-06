import { Component, OnInit } from '@angular/core';
import { FingerprintService, MembersService } from '../_services';
import { Member } from '../_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fingerprint',
  templateUrl: './fingerprint.component.html',
  styleUrls: ['./fingerprint.component.css']
})
export class FingerprintComponent implements OnInit {
  member : Member =  null;
  members: Member[];
  step = 0;

  constructor(private fpService:FingerprintService, 
    private memService : MembersService,
    private _router: Router) { }

  ngOnInit(): void {
    this.memService.getMembers().subscribe(mems => {
      this.members = mems;
    });
  }
  
  gotoHome() {
    this._router.navigate(['/']);
  }

  registerStep1(mem: Member) {
    this.member = mem;
    this.step = 1;
    this.fpService.EnrollStep1().subscribe(s1Rep => {
      if (s1Rep) {
        this.step = 2
      } else {
        this.step = 0;
        this.member = null;
      }
    });
  }

  registerStep2() {
    this.step = 3;
    this.fpService.EnrollStep2(this.member.memberNo).subscribe(s2Rep => {
      if (s2Rep) {
        this.step = 4
      } else {
        this.step = 0;
        this.member = null;
      }
    });
  }
  complete() {
    this.step = 0;
    this.member = null;
  }
}
