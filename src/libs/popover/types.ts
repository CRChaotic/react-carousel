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
    element:HTMLElement;  
    middlewareData:{
        [k:string|number]:any;
    };
}

export interface Modify {
    targetRect:DOMRect;
    boundaryRect:DOMRect;
    elementRect:DOMRect;
    element:HTMLElement;  
    popoverRect:PopoverRect;
    middlewareData:{
        [k:string|number]:any;
    };
}

export interface After {
    targetRect:DOMRect;
    boundaryRect:DOMRect;
    elementRect:DOMRect;
    element:HTMLElement;  
    popoverRect:PopoverRect;
    middlewareData:{
        [k:string|number]:any;
    };
}

export interface Middleware{
    name:string;
    before?:(context:Before) => void;
    modify?:(context:Modify) => void;
    after?:(context:After) => void;
}

export type MiddlewareData = {
    [k:string|number]:any;
}