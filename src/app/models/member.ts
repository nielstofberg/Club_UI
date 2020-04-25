import { MemberType } from './membertype'
import { Rifle } from './rifle'

export interface Member {
    memberId: number;
    memberNo: number;
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
    notes: string;
    memberTypeId: number;
    memberType: MemberType;
    rifles: Rifle[];
}