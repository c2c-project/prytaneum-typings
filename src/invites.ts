import { ObjectId } from 'mongodb';
import faker from 'faker';
import { Roles, pickRole } from './index';

/**
 * expiration will be part of the jwt
 */
export interface InviteLink<T extends string | ObjectId = string> {
    _id: T;
    inviter: T;
    roles: Roles[];
    limit: number;
    uses: number;
}

export const makeInviteLink = (): InviteLink => ({
    _id: faker.random.alphaNumeric(12),
    inviter: faker.random.alphaNumeric(12),
    roles: [pickRole()],
    limit: faker.random.number(5),
    uses: faker.random.number(2),
});
