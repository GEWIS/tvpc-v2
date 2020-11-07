import {IList} from "./list";
import {ICard} from "./card";
import {ILabel} from "./label";

export interface IBoard {
    id: string;

    /** Deprecated */
    name: string;

    descData: string | null;
    closed: boolean;
    idOrganization: string;
    pinned: boolean;
    url: string;
    shortUrl: string;
    prefs: object;
    labelNames: object;

    lists: IList[];
    cards: ICard[];
    labels: ILabel[];
}
