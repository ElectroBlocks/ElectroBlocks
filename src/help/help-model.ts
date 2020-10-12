
export interface Help {
    blockName: string;
    information: string;
    type: HelpType;
    data: HelpYoutube | HelpPicture
}

export interface HelpYoutube {
    youtubeId: string;
}

export interface HelpPicture {
    url: string;
    alt: string;
}

export enum HelpType {
    PICTURE = "PICTURE",
    YOUTUBE = "YOUTUBE"
}