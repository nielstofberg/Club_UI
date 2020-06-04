import { Member } from './member';

export interface Locker {
    lockerId: number;
    location: string;
    lockerNumber: number;
    description: string;
    ownerMemberId: number;
    ownerMember: Member;
    owned: boolean;
    annualFee: number;
    notes: string;
}