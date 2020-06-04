import {MemberType, Rifle, MemberLevel, Locker} from './index' 

export interface Member {
    memberId: number;
    memberNo: number;
    joinDate: Date;
    probEndDate: Date;
    pin: string;
    firstName: string;
    middleName: string;
    surname: string;
    address: string;
    postCode: string;
    phoneMobile: string;
    phoneHome: string;
    phoneWork: string;
    email: string;
    gender: string;
    birthday: Date;
    picture: string; // uri of picture;
    keyholder: boolean;
    facNumber: string;
    NsraNumber: string;
    notes: string;
    memberLevelId: number;
    memberLevel: MemberLevel;
    memberTypeId: number;
    memberType: MemberType;
    rifles: Rifle[];
    lockers: Locker[];
    lastSignIn: Date;
    administrator: boolean;
}