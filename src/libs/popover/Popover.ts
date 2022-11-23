import { Modifier } from "./modifiers/Modifier.js";
import { createPopoverRect } from "./utils/createPopoverRect";
import { getClippedBoundaryRect } from "./utils/getClippedBoundaryRect.js";
import { getDocumentRect } from "./utils/getDocumentRect.js";
import { getOverlapRect } from "./utils/getOverlap.js"
import { getViewportRect } from "./utils/getViewportRect.js";
import { getVirtualElement } from "./utils/getVirtualElement.js";
import { CrossAxis, MainAxis, PopoverRect } from "./utils/PopoverRect.js";
import { RectElement } from "./utils/RectElement.js";

import "./styles/Popover.css";

export type Placements = {
    top?:CrossAxis;
    bottom?:CrossAxis;
    left?:CrossAxis;
    right?:CrossAxis;
};
export type RootBoundary = "viewport"|"document"
export type ModifierConfig = {
    modifier:Modifier;
    options?:{[k:string|number]:any};
}

type ModifiersData = {
    [k:string|number]:any;
}

class Popover {

    element:HTMLElement;
    target:RectElement;
    placements:Placements;
    modifiers: ModifierConfig[];
    boundaries: RectElement[];
    rootBoundary: RootBoundary;
    private modifiersData: ModifiersData;

    constructor(element:HTMLElement, target:RectElement){
        this.element = element;
        this.target = target;
        this.placements = {bottom:"middle", top:"middle", right:"middle", left:"middle"};
        this.modifiers = [];
        this.boundaries = [];
        this.rootBoundary = "viewport";
        this.modifiersData = {};
    }
 
    prioritize(popoverRects:PopoverRect[], boundaryRect:DOMRect){

        let fittestPopboxRect = null;
        let largestArea = -1;

        for(let popoverRect of popoverRects){

            let overlapRect = getOverlapRect(popoverRect, boundaryRect);
            let overlapArea = Math.floor(Math.max(overlapRect.width, 0) * Math.max(overlapRect.height, 0));

            if(largestArea < overlapArea){
                largestArea = overlapArea;
                fittestPopboxRect = popoverRect;
            }
        }

        return fittestPopboxRect!;
    }

    getRootBoundary(){
        return this.rootBoundary;
    }

    getRootBoundaryRect(){
        if(this.getRootBoundary() === "viewport"){
            return getViewportRect();
        }else if(this.getRootBoundary() === "document"){
            return getDocumentRect();
        }
    }

    getBoundaryRect(){
        const rootBoundaryElement = getVirtualElement(this.getRootBoundaryRect());
        return getClippedBoundaryRect([rootBoundaryElement, ...this.boundaries]);
    }

    getTargetRect(){
        return this.target.getBoundingClientRect();
    }

    getElementRect(){
        return this.element.getBoundingClientRect();
    }

    //modifies popoverRect
    update(){

        const boundaryRect = this.getBoundaryRect();
        const targetRect = this.getTargetRect();
        const elementRect = this.getElementRect();

        for(let {modifier, options} of this.modifiers){

            const name = modifier.name;
            this.modifiersData[name] = {};

            if(modifier.before){
                modifier.before({
                    targetRect, 
                    boundaryRect,
                    elementRect,
                    options,
                    modifiersData: this.modifiersData[name]
                });
            }
            
        }

        const popoverRects = [];

        for(let placement of Object.entries(this.placements)){
            
            let [mainAxis, crossAxis] = placement as [MainAxis, CrossAxis];
            const popoverRect = createPopoverRect({targetRect, elementRect, mainAxis, crossAxis});
            popoverRects.push(popoverRect);

            //ajusting
            for(let {modifier, options} of this.modifiers){

                const name = modifier.name;
  
                if(modifier.modify){
                    modifier.modify({
                        targetRect, 
                        boundaryRect,
                        elementRect,
                        popoverRect, 
                        options, 
                        modifiersData: this.modifiersData[name]
                    });
                }

            }
        }

        //prioritizing
        const popoverRect = this.prioritize(popoverRects, boundaryRect);

        for(let {modifier, options} of this.modifiers){
            const name = modifier.name;

            if(modifier.after){
                modifier.after({
                    targetRect, 
                    boundaryRect, 
                    popoverRect,
                    elementRect,
                    element:this.element, 
                    options, 
                    modifiersData: this.modifiersData[name]
                });
            }
        }

        return {popoverRect, modifiersData:this.modifiersData};
    }
}

export default Popover;