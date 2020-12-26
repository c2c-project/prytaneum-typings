import faker from 'faker';
import { ObjectId } from 'mongodb';
import { Meta, makeMetaField, WrapPayload } from '.';

const past = faker.date.past();
const future = faker.date.future();

export interface FileAttachment {
    type: 'file';
    name: string;
    file: string; // this will be a url on the server to download that file
}

export const makeFileAttachment = (): FileAttachment => {
    return {
        type: 'file',
        name: faker.random.word(),
        file: faker.random.word(), // TODO: maybe make this a better 'random'
    };
};

export interface UrlAttachment {
    type: 'url';
    name: string;
    url: string; // e.g. some youtube video
}

export const makeUrlAttachment = (): UrlAttachment => {
    return {
        type: 'url',
        name: faker.random.word(),
        url: faker.random.word(), // TODO: maybe make this a better 'random'
    };
};

export type TownhallAttachment = FileAttachment | UrlAttachment;

export const makeTownhallAttachment = (): TownhallAttachment => {
    return Math.random() > 0.5 ? makeUrlAttachment() : makeFileAttachment();
};

export type ModeratorPermissions = 'TODO';
export interface Moderator {
    permissions: ModeratorPermissions[];
    // name: Name;
    email: string;
}

export interface ModeratorForm {
    email: string;
}

export const makeModerator = (): Moderator => ({
    permissions: ['TODO'],
    // name: makeName(),
    email: faker.internet.email(),
});

export interface TownhallSettings {
    waitingRoom: {
        enabled: boolean;
        scheduled: null | Date;
    };
    chat: {
        enabled: boolean;
        automated: boolean;
    };
    questionQueue: {
        transparent: boolean;
        automated: boolean;
        // TODO: prepopulated questions (if transparent then users can see these)
    };
    credits: {
        enabled: boolean;
        list: string[]; // user id's
    };
    attachments: {
        // TODO: change to attachments
        enabled: boolean;
        list: TownhallAttachment[];
    };
    moderators: {
        list: Moderator[];
    };
    speakers: {
        list: Speaker[];
    };
    registration: {
        reminders: {
            enabled: boolean;
            customTimes: string[]; // TODO: ISO times, don't need this now
        };
        registrants: string[]; // TODO: emails or userIds idk yet -- how to prevent abuse?
    };
    video: {
        url: string;
    };
}

export const makeTownhallSettings = (): TownhallSettings => {
    return {
        waitingRoom: {
            enabled: Math.random() > 0.5,
            scheduled: null,
        },
        chat: {
            enabled: Math.random() > 0.5,
            automated: Math.random() > 0.5,
        },
        questionQueue: {
            transparent: Math.random() > 0.5,
            automated: Math.random() > 0.5,
        },
        credits: {
            enabled: Math.random() > 0.5,
            list: [],
        },
        attachments: {
            enabled: Math.random() > 0.5,
            list: [],
        },
        moderators: {
            list: [makeModerator()],
        },
        speakers: {
            list: [makeSpeaker()],
        },
        registration: {
            reminders: {
                enabled: Math.random() > 0.5,
                customTimes: [],
            },
            registrants: [],
        },
        video: {
            url: '',
        },
    };
};

export interface TownhallForm {
    title: string;
    date: Date | string;
    description: string;
    private: boolean; // TODO: what does this mean? might put this in the form itself
    topic: string;
}

export const makeTownhallForm = (): TownhallForm => {
    return {
        title: faker.random.words(5),
        date: faker.date.between(past, future),
        description: faker.lorem.words(),
        private: Math.random() > 0.5,
        topic: faker.random.words(),
    };
};

export interface Speaker {
    name: string; // speaker's name written however, first and last don't matter
    title: string; // speaker's official title
    picture: string; // speaker's picture
    description: string; // description of who the speaker is
}

export const makeSpeaker = (): Speaker => ({
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    picture: faker.image.imageUrl(),
    title: faker.name.jobTitle(),
    description: faker.lorem.lines(5),
});

export interface QuestionForm<T extends string | ObjectId = string> {
    question: string;
    quote?: T;
}

export const makeQuestionForm = (): QuestionForm => {
    return {
        question: faker.lorem.lines(),
        quote: Math.random() > 0.5 ? faker.random.alphaNumeric(12) : undefined,
    };
};

// TODO: delete this after implementing question queue
export type QuestionState = '' | 'in_queue' | 'asked' | 'current';

export const pickQuestionState = (): QuestionState => {
    const choice = Math.random();
    // able to forgo the && choice > in each else-if statement due to short circuit evaluation
    if (choice < 0.25) {
        return '';
    } else if (choice < 0.5) {
        return 'in_queue';
    } else if (choice < 0.75) {
        return 'asked';
    } else {
        return 'current';
    }
};

export interface Reply<T extends string | ObjectId = string> {
    _id: T;
    meta: Meta<T>;
    replies: Reply<T>[];
    reply: string;
}

export const makeReply = (): Reply => ({
    _id: faker.random.alphaNumeric(12),
    meta: makeMetaField(),
    replies: Math.random() > 0.5 ? [] : [makeReply()],
    reply: faker.lorem.lines(2),
});

export interface ReplyForm {
    reply: string;
}

export const makeReplyForm = (): ReplyForm => ({
    reply: faker.lorem.lines(2),
});

export interface Question<T extends string | ObjectId = string> {
    _id: T;
    meta: Meta<T> & {
        townhallId: T;
    };
    question: string;
    quote: Question<T> | null;
    state: QuestionState;
    likes: ObjectId[];
    aiml: {
        labels: string[];
    };
    visibility: Visibility;
    replies: Reply<T>[];
}

export const makeQuestion = (): Question => {
    return {
        _id: faker.random.alphaNumeric(12),
        meta: {
            ...makeMetaField(),
            townhallId: faker.random.alphaNumeric(12),
        },
        question: faker.lorem.lines(2),
        quote: Math.random() > 0.5 ? makeQuestion() : null,
        state: pickQuestionState(),
        likes: [],
        aiml: {
            labels: [],
        },
        visibility: pickVisibility(),
        replies: Math.random() > 0.5 ? [] : [makeReply()],
    };
};

export type Visibility = 'visible' | 'hidden';

export const pickVisibility = (): Visibility => {
    const choice = Math.random();
    return choice > 0.5 ? 'visible' : 'hidden';
};

// TODO: last updated field
export interface ChatMessage<T extends string | ObjectId = string> {
    _id: T;
    meta: Meta<T> & {
        townhallId: T;
    };
    visibility: Visibility;
    message: string;
}

export const makeChatMessage = (): ChatMessage => ({
    _id: faker.random.alphaNumeric(12),
    meta: { ...makeMetaField(), townhallId: faker.random.alphaNumeric(12) },
    message: faker.lorem.lines(3),
    visibility: pickVisibility(),
});

export interface ChatMessageForm {
    message: string;
}

export const makeChatMessageForm = (): ChatMessageForm => ({
    message: faker.lorem.lines(3),
});

export type Panes = 'Question Feed' | 'Chat' | 'Information';

// export type SocketNamespaces = '/townhall-messages' | '/townhall-questions';

// export interface SocketEvents {
//     '/townhall-messages': 'message-state';
//     // '/townhall-'
// }

// export interface SocketEventPayload<T, U> {
//     type: T;
//     payload: U;
// }

export interface TownhallState<T extends string | ObjectId = string> {
    active: boolean;
    // TODO: move this inside of active?
    start: Date | null;
    end: Date | null;
    attendees: {
        current: number;
        max: number;
        // TODO: other stats so we can show a graph?
        // engagement and attendees per question?
    };

    // we copy the questions because we don't want edits after the fact to affect the asked question last second
    // we will possibly not allow edits
    playlist: {
        position: {
            current: number; // 0-indexed; max will be limited by the length of the queue -- starts at -1 if there's no current question
            timestamps: string[];
        };
        queue: Question<T>[];
        list: Question<T>[];
    };
}

export const makeTownhallState = (): TownhallState => ({
    active: true,
    start: faker.date.recent(),
    end: null,
    attendees: {
        current: faker.random.number(5),
        max: faker.random.number(10),
    },
    playlist: {
        position: { current: Math.random() > 0.5 ? 0 : -1, timestamps: [] },
        queue: [makeQuestion()],
        list: [makeQuestion()],
    },
});

export interface Townhall<T extends string | ObjectId = string> {
    _id: T;
    meta: Meta<T>;
    form: TownhallForm;
    settings: TownhallSettings;
    state: TownhallState<T>;
}

export const makeTownhall = (): Townhall => ({
    _id: faker.random.alphaNumeric(12),
    form: makeTownhallForm(),
    meta: makeMetaField(),
    settings: makeTownhallSettings(),
    state: makeTownhallState(),
});

export const makeTownhalls = (
    amount?: number,
    callback?: (t: Townhall) => Townhall // for transforming each townhall if needed
): Townhall[] => {
    const list = [];
    const iterations = amount || 10;
    for (let i = 0; i < iterations; i += 1) {
        let townhall = makeTownhall();
        if (callback) townhall = callback(townhall);
        list.push(townhall);
    }
    return list;
};

/**
 * SOCKETIO CONTRACTS
 */

export interface SocketIOEvents<T extends string | ObjectId = string> {
    'chat-message-state':
        | WrapPayload<'create-chat-message', ChatMessage<T>>
        | WrapPayload<'update-chat-message', ChatMessage<T>>
        | WrapPayload<'delete-chat-message', ChatMessage<T>>
        | WrapPayload<'moderate-chat-message', ChatMessage<T>>;

    'question-state':
        | WrapPayload<'initial-state', Question<T>[]>
        | WrapPayload<'create-question', Question<T>>
        | WrapPayload<'update-question', Question<T>>
        | WrapPayload<'delete-question', Question<T>>;

    'playlist-state':
        | WrapPayload<'playlist-add', Question<T>>
        | WrapPayload<'playlist-remove', string>
        | WrapPayload<'playlist-queue-order', Question<T>[]>
        | WrapPayload<'playlist-queue-add', Question<T>>
        | WrapPayload<'playlist-queue-remove', string>
        | WrapPayload<'playlist-queue-next', null>;

    'townhall-state':
        | WrapPayload<'user-attend', null>
        | WrapPayload<'user-leave', null>
        | WrapPayload<'townhall-start', null>
        | WrapPayload<'townhall-end', null>;
}
