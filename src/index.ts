import faker from 'faker';
import { ObjectId } from 'mongodb';
import { Townhall, Question, ChatMessage } from './townhall';
import { InviteLink } from './invites';

export type ReferenceNames =
    | 'Github'
    | 'LinkedIn'
    | 'resume'
    | 'personalWebsite'
    | 'email'
    | 'phone'
    | 'other';

interface Reference {
    link: string;
    // NOTE: If necessary, add more types of references in the future. There must be an icon for each Reference.name
    name: ReferenceNames;
}

export interface TeamMember {
    picturePath?: string;
    fullName: string;
    subtitle: string;
    description: string;
    startDate: string;
    endDate: string;
    references?: Reference[];
}

export interface Team {
    name: string;
    members: TeamMember[];
}
/**
 * name interface used for all "name" fields in db collections
 */
export interface Name {
    first: string;
    last: string;
}

export const makeName = (): Name => {
    return {
        first: faker.name.firstName(),
        last: faker.name.lastName(),
    };
};

/**
 * on the client _id will be a string, on the server the _id will be an object id
 */
export interface User<T extends string | ObjectId = string> {
    _id: T;
    meta: {
        createdAt: Date | string;
        lastLogin: Date | string;
    };
    roles: Roles[];
    email: {
        verified: boolean;
        address: string;
    };
    password: string;
    name: Name;
    settings: {
        townhall: {
            anonymous: boolean;
        };
        notifications: {
            enabled: boolean;
            types: string[];
        };
    };
}

export const makeUser = (): User => {
    return {
        _id: faker.random.alphaNumeric(12),
        meta: {
            createdAt: faker.date.recent(),
            lastLogin: faker.date.recent(),
        },
        roles: [pickRole()],
        email: {
            verified: Math.random() < 0.5,
            address: faker.internet.email(),
        },
        password: faker.internet.password(),
        name: makeName(),
        settings: {
            townhall: {
                anonymous: Math.random() > 0.5,
            },
            notifications: {
                enabled: Math.random() > 0.5,
                types: [], // TODO:
            },
        },
    };
};

/**
 * Fields from the user document that are safe to send to the client in almost any scenario
 */
export type ClientSafeUser<T extends string | ObjectId = string> = Pick<
    User<T>,
    '_id' | 'email' | 'name' | 'roles' | 'settings'
>;

export interface UserHistory<T extends string | ObjectId = string> {
    _id: T;
    userId: T;
    history: {
        actions: {
            timestamp: Date | number | string;
            action: string; // TODO:
        }[];
        townhall: {
            _id: T;
            title: string;
            timestamp: Date | number | string;
            tags: string[]; // stuff like attended/moderated/banned/viewed/etc
        }[];
    };
}

export const makeUserHistory = (): UserHistory => ({
    _id: faker.random.alphaNumeric(12),
    userId: faker.random.alphaNumeric(12),
    history: {
        actions: [
            {
                timestamp: faker.date.recent(),
                action: '',
            },
        ],
        townhall: [
            {
                _id: faker.random.alphaNumeric(12),
                title: faker.random.words(),
                timestamp: faker.date.recent(),
                tags: [],
            },
        ],
    },
});

export type Roles = 'organizer' | 'admin' | '';

export const pickRole = (): Roles => {
    const choice = Math.random();
    if (choice < 0.33) {
        return 'organizer';
    } else if (choice < 0.66) {
        return 'admin';
    } else {
        return '';
    }
};

/**
 * general meta field on any database doc
 */
export interface Meta<T extends string | ObjectId = string> {
    createdAt: Date | string;
    createdBy: {
        _id: T;
        name: Name;
    };
    updatedAt: Date | string;
    updatedBy: {
        _id: T;
        name: Name;
    };
}

export const makeMetaField = (): Meta => {
    return {
        createdAt: faker.date.recent(),
        createdBy: {
            _id: faker.random.alphaNumeric(12),
            name: makeName(),
        },
        updatedAt: faker.date.recent(),
        updatedBy: {
            _id: faker.random.alphaNumeric(12),
            name: makeName(),
        },
    };
};

export type WrapPayload<Type extends string, Payload> = {
    type: Type;
    payload: Payload;
};

export interface Pagination {
    page: number;
    limit: number;
    // if we get a request with 0 results back then we know it's the end of the collection
    hasNext: boolean; // check if this is needed or whether we can solve with the cursor
}

// export interface Filters<T extends Record<string,unknown>> {
//     [P in T]:
// }

export * from './auth';
export * from './townhall';
export * from './invites';
export * from './notifications';
export * from './feedback';

export function makeGenFn<T>(fn: () => T) {
    return (iterations: number) => {
        const ret: T[] = [];
        for (let i = 0; i < iterations; i += 1) {
            ret.push(fn());
        }
        return ret;
    };
}

/**
 * SOCKETIO CONTRACTS
 */

export type SubscriptionTypes = 'create' | 'update' | 'delete';
export interface Subscriptions<T extends string | ObjectId = string> {
    Users: { type: SubscriptionTypes; payload: User<T> };
    Townhalls: { type: SubscriptionTypes; payload: Townhall<T> };
    Questions: { type: SubscriptionTypes; payload: Question<ObjectId> };
    ChatMessages: { type: SubscriptionTypes; payload: ChatMessage<ObjectId> };
    InviteLinks: { type: SubscriptionTypes; payload: InviteLink<ObjectId> };
}
