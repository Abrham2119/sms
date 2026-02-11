import type { Branch } from './branch.entry.ts';
import type { Account } from './account.entry.ts';

export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export const MemberStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    SUSPENDED: "SUSPENDED",
    PENDING: "PENDING",
} as const;
export type MemberStatus = (typeof MemberStatus)[keyof typeof MemberStatus];

export const MarriageStatus = {
    SINGLE: "SINGLE",
    MARRIED: "MARRIED",
    DIVORCED: "DIVORCED",
    WIDOWED: "WIDOWED",
} as const;
export type MarriageStatus = (typeof MarriageStatus)[keyof typeof MarriageStatus];

export interface Member {
    id: string;
    full_name: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    monthly_income: number;
    gender: string;
    age: number;
    registration_fee: number;
    membership_number: string;
    status: string;
    phone_number: string;
    branch_id: string;
    branch: Branch;
    birth_place: string;
    birth_district: string;
    birth_neighborhood: string;
    birth_zone: string;
    birth_subcity: string;
    birth_region: string;
    birth_house_number: string;
    current_region: string;
    current_district: string;
    current_neighborhood: string;
    current_zone: string;
    current_subcity: string;
    current_house_number: string;
    number_of_children_boys: number;
    number_of_children_girls: number;
    marriage_status: string;
    spouse_name: string;
    photo: string;
    id_photo: string;
    method_of_identification: string;
    identification_number: string;
    children: any[] | null;
    heirs: any[] | null;
    emergency_contacts: any[] | null;
    created_at: string;
    updated_at: string;
    accounts: Account[];
}
