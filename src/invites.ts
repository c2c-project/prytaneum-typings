import { ObjectId } from 'mongodb';
import faker from 'faker';

export interface InviteLink<T extends string | ObjectId = string> {
    _id: T;
    inviter: T;
    uses: {
        limit: number;
        attempted: number;
    };
}

export const makeInviteLink = (): InviteLink => ({
    _id: faker.random.alphaNumeric(12),
    inviter: faker.random.alphaNumeric(12),
    uses: {
        limit: Math.random() * 10,
        attempted: Math.random() * 5,
    },
});
