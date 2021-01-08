import { ObjectId } from 'mongodb';
import { Meta } from '.';

/**
 * Metadata for uploaded csv file
 */
export interface NotificationMetaData {
    name: string;
    size: number; // Size in bytes
    sentDateTime: string; // UTC Format
}

export interface Notification<T extends string | ObjectId = string> {
    _id: T;
    region: string;
    unsubscribeList: Array<string>;
    subscribeList: Array<string>;
    inviteHistory: Array<NotificationMetaData>;
    meta: Meta<T>;
}
