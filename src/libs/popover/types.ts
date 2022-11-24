

export type MainAxis = "top"|"bottom"|"left"|"right"
export type CrossAxis = "start"|"middle"|"end"

export type Placement = {
    mainAxis: MainAxis;
    crossAxis: CrossAxis;
}

export type RootBoundary = "viewport"|"document"

export type RectElement = {
    [k:string|number]:any;
    getBoundingClientRect:() => DOMRect;
};

export interface PopoverRect extends DOMRect{
    translateX:number;
    translateY:number;
    x:number;
    y:number;
    width:number;
    height:number;
    readonly left:number;
    readonly right:number;
    readonly bottom:number;
    readonly top:number;
    readonly mainAxis:MainAxis;
    readonly crossAxis:CrossAxis;
}

export interface Before {
    targetRect:DOMRect;
    boundaryRect:DOMRect;
    elementRect:DOMRect; 
    options?:{[k:string|number]:any};
    middlewareData:{
        [k:string|number]:any;
    };
}

export interface Modify {
    targetRect:DOMRect;
    boundaryRect:DOMRect;
    elementRect:DOMRect;  
    popoverRect:PopoverRect;
    options?:{[k:string|number]:any};
    middlewareData:{
        [k:string|number]:any;
    };
}

export interface After {
    targetRect:DOMRect;
    boundaryRect:DOMRect;
    elementRect:DOMRect;  
    popoverRect:PopoverRect;
    element:HTMLElement;
    options?:{[k:string|number]:any};
    middlewareData:{
        [k:string|number]:any;
    };
}


export interface Middleware{
    name:string;
    before?:({targetRect, elementRect, boundaryRect, middlewareData}:Before) => void;
    modify?:({targetRect, elementRect, boundaryRect, popoverRect, middlewareData}:Modify) => void;
    after?:({targetRect, elementRect, boundaryRect, popoverRect, element, middlewareData}:After) => void;
}


export type MiddlewareConfig = {
    middleware: Middleware;
    options?:{[k:string|number]:any};
}

export type MiddlewareData = {
    [k:string|number]:any;
}