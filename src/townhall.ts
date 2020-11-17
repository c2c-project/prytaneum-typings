import { ObjectId } from 'mongodb';
import { Meta, Name } from '.';

export interface Townhall {
    _id: string | ObjectId;
    meta: Meta;
    form: TownhallForm;
    settings: TownhallSettings;
}

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
    links: {
        enabled: boolean;
        list: {
            name: string;
            url: string;
        }[];
    };
    moderators: {
        list: string[]; // userid[]
        primary: string; // primary user id
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
}

export interface TownhallForm {
    title: string;
    date: Date | string;
    description: string;
    private: boolean; // TODO: what does this mean? might put this in the form itself
    topic: string;
}

export interface Speaker {
    name: string; // speaker's name written however, first and last don't matter
    title: string; // speaker's official title
    picture: string; // speaker's picture
    description: string; // description of who the speaker is
}

export interface QuestionForm {
    question: string;
}

export type QuestionState = '' | 'IN_QUEUE' | 'ASKED' | 'CURRENT';
export interface Question {
    _id: string | ObjectId;
    meta: {
        original?: string; // will be a question id if it's an edit of something else
        townhallId: string | ObjectId;
        user: {
            _id: string | ObjectId;
            name: Name;
        };
        timestamp: Date | string;
    };
    question: string;
    state: QuestionState;
    likes: string[]; // array of user id's
    aiml: {
        labels: string[];
    };
}

// TODO: last updated field
export interface ChatMessage {
    _id: string | ObjectId;
    meta: Meta & {
        townhallId: string | ObjectId;
    };
    message: string;
}

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
