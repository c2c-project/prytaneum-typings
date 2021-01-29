import faker from 'faker/locale/en';
import { ObjectId } from 'mongodb';
import { Meta, makeMetaField } from '.';

function makeDummyList<T>(
    makeDummyObject: () => T,
    amount?: number,
    callback?: (d: T) => T
): T[] {
    const list = [];
    const iterations = amount || 10;
    for (let i = 0; i < iterations; i += 1) {
        let dummyObject = makeDummyObject();
        if (callback) dummyObject = callback(dummyObject);
        list.push(dummyObject);
    }
    return list;
}

export interface ReportReply {
    content: string;
    meta: Meta;
}

export const makeReportReply = (): ReportReply => ({
    content: faker.lorem.paragraph(),
    meta: makeMetaField(),
});

export const makeReportReplies = (
    amount?: number,
    callback?: (t: ReportReply) => ReportReply // for transforming each reply if needed
): ReportReply[] => makeDummyList(makeReportReply, amount, callback);

export interface Report {
    description: string;
    resolved?: boolean;
    replies: ReportReply[];
}

export const makeReport = (): Report => ({
    description: faker.lorem.paragraphs(),
    resolved: faker.random.boolean(),
    replies: makeReportReplies(),
});

export const makeReports = (
    amount?: number,
    callback?: (t: Report) => Report // for transforming each reply if needed
): Report[] => makeDummyList(makeReport, amount, callback);

export interface FeedbackReport<T extends string | ObjectId = string>
    extends Report {
    _id: T;
    meta: Meta<T>;
}

export const makeFeedbackReport = (): FeedbackReport => ({
    ...makeReport(),
    meta: makeMetaField(),
    _id: faker.random.alphaNumeric(12),
});

export const makeFeedbackReports = (
    amount?: number,
    callback?: (t: FeedbackReport) => FeedbackReport // for transforming each feedback report if needed
): FeedbackReport[] => makeDummyList(makeFeedbackReport, amount, callback);

export interface BugReport<T extends string | ObjectId = string>
    extends Report {
    _id: T;
    meta: Meta<T>;
    townhallId: T;
}

export const makeBugReport = (): BugReport => ({
    ...makeReport(),
    meta: makeMetaField(),
    _id: faker.random.alphaNumeric(12),
    townhallId: faker.random.alphaNumeric(12),
});

export const makeBugReports = (
    amount?: number,
    callback?: (t: BugReport) => BugReport // for transforming each bug report if needed
): BugReport[] => makeDummyList(makeBugReport, amount, callback);

export interface ReportForm {
    description: string;
}

export const makeReportForm = (): ReportForm => ({
    description: faker.lorem.words(),
});

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FeedbackForm extends ReportForm {
    // Add more fields in the future if needed
}

export const makeFeedbackReportForm = (): FeedbackForm => ({
    ...makeFeedbackReport(),
});

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BugReportForm extends ReportForm {
    // Add more fields in the future if needed
}

export const makeBugReportForm = (): BugReportForm => ({
    ...makeFeedbackReport(),
});
