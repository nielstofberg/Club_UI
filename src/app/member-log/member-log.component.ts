import { Component, OnInit } from '@angular/core';
import { Member } from '../models/member';
import { MembersService } from '../services/members.service';
import { Attendance } from '../models/attendance';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Activity } from '../models/activity';
import { FingerprintService } from '../services/fingerprint.service';

@Component({
  selector: 'app-member-log',
  templateUrl: './member-log.component.html',
  styleUrls: ['./member-log.component.css']
})
export class MemberLogComponent implements OnInit {
  entryDate: number;
  memberId: number = 0;
  member: Member;
  attendance: Attendance;
  activities: Activity[];
  attendanceform: FormGroup;
  jimmy=false;

  constructor(private fps: FingerprintService, private ms: MembersService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.ms.getActivities().subscribe(result => {
      this.activities = result;
    })
  }

  cancel() {
    this.memberId = 0;
    this.attendanceform = null;
  }

  getUser() {
    /**************************************************
     * At this point call the fingerprint api and 
     * get the memberId from the fingerprint reader
     **************************************************/
    this.fps.ReadFp().subscribe(response => {
      if (!response['matched']) return;

      var sid = response['id'];
      this.ms.getMember(sid).subscribe(r => {
        this.member = r;
        this.attendanceform = this.fb.group({
          attendanceId: [0, Validators.required],
          memberId: [this.memberId, Validators.required],
          date: [new Date().toLocaleString(), Validators.required],
          seasonTicket: [false, Validators.required],
          payment: [this.member.memberType.rangeFee, Validators.required],
          activityId: [null, Validators.required],
          rifleId: [null],
        });
        this.memberId = sid;
        this.entryDate = Date.now();
      });
    });
  }

  setRangeFee(set: number) {
    if (set==0) {
      this.attendanceform.get('payment').setValue(0);
      this.attendanceform.get('seasonTicket').setValue(true);
    }
    else if (set==1) {
      this.attendanceform.get('payment').setValue(this.member.memberType.rangeFee);
      this.attendanceform.get('seasonTicket').setValue(false);
    }
    else {
      this.attendanceform.get('payment').setValue(0);
      this.attendanceform.get('seasonTicket').setValue(true);
    }
  }

  onFormSubmit() : void {
  }


  seasonTicketChanged(event) {
    this.attendanceform.get('seasonTicket').setValue(event.currentTarget.checked);
    var ctrl = this.attendanceform.get('payment');
    if (event.currentTarget.checked) {
      ctrl.setValue(0);
    }
    else {
      ctrl.setValue(this.member.memberType.rangeFee);
    }
  }

  activityChanged(event, act: Activity) {
    if (event.currentTarget.checked)
    {
      var st = this.attendanceform.get('seasonTicket').value;
      var ctrl = this.attendanceform.get('payment');
      if (act.fee && !st) {
        ctrl.setValue(this.member.memberType.rangeFee);
      }
      else {
        ctrl.setValue(0);
      }

    }

  }
}
