import { Activity } from './activity';
import { Rifle } from './rifle';
import { Member } from './member';

export interface Attendance {
    attendanceId: number;
    date: Date;
    seasonTicket: boolean;
    payment: number;
    memberId: number;
    member: Member;
    rifleId: number;
    rifle: Rifle;
    activityId: number;
    activity: Activity;
}