
export type RectElement = {
    [k:string|number]:any;
    getBoundingClientRect:() => DOMRect;
};