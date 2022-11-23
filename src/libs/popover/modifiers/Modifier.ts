import { PopoverRect } from "../utils/PopoverRect";

interface Before {
    targetRect:DOMRect;
    boundaryRect:DOMRect;
    elementRect:DOMRect; 
    options?:{[k:string|number]:any};
    modifiersData:{
        [k:string|number]:any;
    };
}

interface Modify {
    targetRect:DOMRect;
    boundaryRect:DOMRect;
    elementRect:DOMRect;  
    popoverRect:PopoverRect;
    options?:{[k:string|number]:any};
    modifiersData:{
        [k:string|number]:any;
    };
}

interface After {
    targetRect:DOMRect;
    boundaryRect:DOMRect;
    elementRect:DOMRect;  
    popoverRect:PopoverRect;
    element:HTMLElement;
    options?:{[k:string|number]:any}; 
    modifiersData:{
        [k:string|number]:any;
    };
}


export interface Modifier{
    name:string;
    before?:({targetRect, elementRect, boundaryRect, modifiersData}:Before) => void;
    modify?:({targetRect, elementRect, boundaryRect, popoverRect, modifiersData}:Modify) => void;
    after?:({targetRect, elementRect, boundaryRect, popoverRect, element, modifiersData}:After) => void;
}

