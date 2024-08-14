/// <reference types="node" resolution-mode="require"/>
import Handlebars from "handlebars";
interface CreateProps {
    context: object;
    template: string | Buffer;
    headerTemplate?: string;
    footerTemplate?: string;
    path?: string;
    margin?: {
        top?: string | number;
        bottom?: string | number;
        left?: string | number;
        right?: string | number;
    };
    puppeteer?: {
        noSandbox?: boolean;
    };
}
export declare function create(props: CreateProps): Promise<Buffer>;
export declare function registerHelpers(conditionName: string, fn: Handlebars.HelperDelegate): void;
export {};
