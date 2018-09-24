export class UserInfo {
    isAnonymous: boolean;
    email: string;
    displayName: string;
    photoURL?: string;
    providerId: string;
    uid: string;
}

export class Timeinfo {
    key: number;
    login_time:string;

}

export class ActivityCount {
    Favorite: number;
    UpVote: number;
    Search: number;
    QuestionClick: number;
    DownVote: number;
}

export class IndividualUserActivityCount {
    Favorite: number;
    UpVote: number;
    Search: number;
    QuestionClick: number;
    DownVote: number;
}

