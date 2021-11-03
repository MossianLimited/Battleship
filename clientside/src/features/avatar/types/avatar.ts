export interface AvatarProperties {
    username?: string;
    seed?: string;
    score?: number;
    chatFeed?: string[];
}

export enum AvatarSide {
    Left = "left",
    Right = "right",
}
