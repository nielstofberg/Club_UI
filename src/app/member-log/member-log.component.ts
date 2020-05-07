import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Attendance, Activity, Member } from '../_models';
import { MembersService, FingerprintService, AttendanceService, AppConfigService } from '../_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-log',
  templateUrl: './member-log.component.html',
  styleUrls: ['./member-log.component.css']
})
export class MemberLogComponent implements OnInit {
  entryDate: Date;
  memberId: number = 0;
  member: Member;
  attendance: Attendance;
  activities: Activity[];
  attendanceform: FormGroup;
  jimmy=false;

  /**
   * Component constructor
   * @param fps FingerprintService
   * @param ms MembersService
   * @param fb FormBuilder
   * @param _router Router
   */
  constructor(private fps: FingerprintService, 
    private ms: MembersService,
    private atts: AttendanceService,
    private config: AppConfigService,
    private fb: FormBuilder,
    private _router: Router) { }


  /**
   * Page ngOnInit function.
   * Populates the activities options.
   */
  ngOnInit(): void {
    this.ms.getActivities().subscribe(result => {
      this.activities = result;
      //this.getMember(89); // use this line for style debug to go streight to the sign in page
    })
  }

  /**
   * Navigate to the Fingerprint admin page.
   * First read the user's fingerprint and if he/she is an administrator
   * then navigate to the admin page.
   */
  goToAdmin() {
    this.fps.ReadFp().subscribe(response => {
      if (!response['matched']) return;
      this.ms.getByMemberNumber(response['id']).subscribe(mem => {
        if (mem.length > 0 && mem[0].administrator) {
          this._router.navigate(['/fingerprint']);
        }
      });
    });
  }

  /**
   * Cancel the signIn form and return to the home view.
   */
  cancel() {
    this.memberId = 0;
    this.attendanceform = null;
  }

  /**
   * Get the memberNumber from the FingerprintService
   * When the API returns the memberNumber, it calls the getMember function.
   */
  identifyMember() {
    this.fps.ReadFp().subscribe(response => {
      if (!response['matched']) return;
      this.getMember(response['id']);
    });
  }

  /**
   * Gets the Member information from the Memberservice
   * and builds the attendanceform FormGroup
   * @param num memberNumber (Not memberID)
   */
  getMember(num: number) : void {
    this.ms.getByMemberNumber(num).subscribe(r => {
      if (r.length>0) {
        this.member = r[0];

        var ld:Date = new Date(this.member.lastSignIn.toLocaleString());
        console.info('member.lastSignIn: ' + this.member.lastSignIn);
        var now = new Date();
        var hours = Math.abs(now.valueOf() - ld.valueOf()) / 36e5;
        console.info(ld.toLocaleString() + ' and ' + now.toLocaleString() + ' and the first is smaller: ' + (ld<now));
        console.info('Hours: ' + hours);
        console.info('AutoLogout after : ' + this.config.autoLogout + 'hours');

        if (hours < this.config.autoLogout) return; // Assume that is last login was less than 10 hours ago you are still logged in.

        this.memberId = this.member.memberId;
        this.entryDate = new Date(Date.now());

        this.attendanceform = this.fb.group({
          attendanceId: [0, Validators.required],
          memberId: [this.memberId, Validators.required],
          date: [new Date().toLocaleString(), Validators.required],
          seasonTicket: [false, Validators.required],
          payment: [this.member.memberType.rangeFee, Validators.required],
          activityId: [null, Validators.required],
          rifleId: [null],
        });
      }
    });
  }

  /**
   * Runs when the attendanceform is submitted
   */
  onFormSubmit() : void {
    if (this.attendanceform.valid)
    {
      var att: Attendance = this.attendanceform.value;
      att.date = this.entryDate;
      this.atts.add(att).subscribe(r => {
        this.memberId = 0;
        this.attendanceform = null;    
      })
    }
  }

  /** 
   * Runs when seasonticket selection changes.
   * Sets the Range fee based on the activity and the season ticket selection
  */   
  seasonTicketChanged(event) {
    this.attendanceform.get('seasonTicket').setValue(event.currentTarget.checked); // this is actually necessary because the value doesn't get set on check-change.
    var actVal:Number = this.attendanceform.get('activityId').value;
    var fee = true;
    if (actVal != null) {
      fee = this.activities.find(a => a.activityId==actVal).fee;
    }
    var ctrl = this.attendanceform.get('payment');
    if (event.currentTarget.checked || !fee) {
      ctrl.setValue(0);
    }
    else {
      ctrl.setValue(this.member.memberType.rangeFee);
    }
  }

  /**
   * Runs when activity selection changes.
   * Sets the Range fee based on the activity and the season ticket selection
   * @param event 
   * @param act 
   */
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
