// Generated by https://quicktype.io

// Generated by https://quicktype.io

export interface PaypalBatchHeader {
    batch_header: BatchHeader;
}

export interface BatchHeader {
    payout_batch_id:     string;
    batch_status:        string;
    sender_batch_header: SenderBatchHeader;
}

export interface SenderBatchHeader {
    sender_batch_id: string;
    email_subject:   string;
}
