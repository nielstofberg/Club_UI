import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { MembersService} from '../_services'
import {Member, MemberType, Rifle} from '../_models'
import { identifierModuleUrl } from '@angular/compiler';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  members: Member[];
  memberTypes: MemberType[];
  selectedMemberId: number = -1;

  formdefaults = {
    memberId: 0,
    keyHolder: false,
  };

  memberForm = this.fb.group({
    memberId: [0, Validators.required],
    memberNo: ['', Validators.required],
    pin: ['', Validators.required],
    firstName: ['', Validators.required],
    middleName: [''],
    surname: ['', Validators.required],
    address: ['', Validators.required],
    postCode: ['', Validators.required],
    phoneMobile: [''],
    phoneHome: [''],
    phoneWork: [''],
    email: [''],
    gender: ['', Validators.required],
    birthday: ['', Validators.required],
    picture: [''],
    keyHolder: [false],
    facNumber: [''],
    administrator: [false],
    notes: [''],
    memberTypeId: [null, Validators.required],
    formRifles: this.fb.array([ ])
  });

  get formRifles() {
    return this.memberForm.get('formRifles') as FormArray;
  }

  /**
   * Component constructor
   * @param memberService
   * @param fb 
   */
  constructor(private memberService:  MembersService, 
    private fb: FormBuilder) { 
  }

  /**
   * Page ngOnInit function
   * Populates the MemberTypes
   */
  ngOnInit(): void {
    this.refreshMembers();
    this.memberService.getMemberTypes().subscribe(result => {
      this.memberTypes = result;
    });
  }

  /**
   * Populates the members list from the MembersService
   */
  refreshMembers() : void {
    this.memberService.getMembers().subscribe(result => {
      this.members = result;
    });
  }


  newMember() {
    this.selectedMemberId = 0;
    this.formRifles.clear();
    this.memberForm.reset();
    this.memberForm.patchValue(this.formdefaults);
  }

  memberSelected(sm : Member) {
    this.memberService.getMember(sm.memberId).subscribe(res => {
      var bd = res.birthday.toString().substr(0,10);
      this.selectedMemberId = res.memberId;
      this.memberForm.patchValue(res);
      this.memberForm.get('birthday').setValue(bd);
      this.memberForm.setControl('formRifles', this.setExistingRifles(res.rifles));
    });
  }

  setExistingRifles(rifleSet : Rifle[]) : FormArray  {
    const formArray = new FormArray([]);
    Array.from(rifleSet).forEach(r=> {
      formArray.push(this.fb.group({
        rifleId: r.rifleId,
        serialNo: r.serialNo,
        make: r.make,
        model: r.model,
        calibre: r.calibre,
        notes: r.notes,
        clubRifle: r.clubRifle,
        ownerMemberId: r.ownerMemberId 
      }));
    });
    return formArray;
  }

  addRifle() {
    var grp = this.fb.group({
      rifleId: [0, Validators.required],
      serialNo: ['', Validators.required],
      make: ['', Validators.required],
      model: [''],
      calibre: ['', Validators.required],
      notes: [''],
      clubRifle: [false],
      ownerMemberId: [this.selectedMemberId, Validators.required]
    })
    this.formRifles.push(grp);
  }

  removeRifle(rifleIndex: number) : void {
    const rifle = this.formRifles.controls[rifleIndex].get('rifleId').value;
    if (rifle > 0) {
      if (confirm("Are you sure you want to delete this rifle from the system?")) {
        this.formRifles.removeAt(rifleIndex);
        this.memberService.deleteRifle(rifle).subscribe(()=>{});
      }
    }
    else {
      this.formRifles.removeAt(rifleIndex);
    }
  }

  /**
   * Runs when Members Form is submitted
   */
  onMemberFormSubmit() {
    if (this.memberForm.valid) {
      if (this.selectedMemberId > 0 && this.memberForm.dirty)
      {
        var mem : Member = this.memberForm.value;
        this.memberService.updateMember(mem).subscribe(r => {
          this.formRifles.controls.forEach(element => {
            if (element.get('rifleId').value==0)
            {
              var rifle: Rifle = element.value;
              rifle.ownerMemberId = mem.memberId;
              this.memberService.addRifle(element.value).subscribe(()=>{});
            }
            else if (element.dirty)
            {
              this.memberService.updateRifle(element.value).subscribe(()=>{});
            }
          });
          this.refreshMembers();
        },error => {
          console.log(error);
        });
      }
      else if (this.selectedMemberId == 0)
      {
        var mem : Member = this.memberForm.value;
        this.memberService.addMember(mem).subscribe(m => {
          this.formRifles.controls.forEach(element => {
            var rifle: Rifle = element.value;
            rifle.ownerMemberId = m.memberId;
            this.memberService.addRifle(element.value).subscribe(()=>{});
        });
          this.refreshMembers();
        },error => {
          console.log(error);
        });
      }
      this.selectedMemberId = -1;
    }
  }

  cancel() {
    this.selectedMemberId = -1;
    this.formRifles.clear();
    this.memberForm.reset();
  }
}
