import * as Modifiers from "./modifiers/Modifiers.js";
import { createPopoverRect } from "./utils/createPopoverRect.js";
import { getClippedBoundaryRect } from "./utils/getClippedBoundaryRect.js";
import { getDocumentRect } from "./utils/getDocumentRect.js";
import { getOverlapRect } from "./utils/getOverlap.js"
import { getViewportRect } from "./utils/getViewportRect.js";
import { getVirtualElement } from "./utils/getVirtualElement.js";

export const Placement = {
    mainAxis:{
        top:"top",
        bottom:"bottom",
        left:"left",
        right:"right"
    },
    crossAxis:{
        start:"start",
        middle:"middle",
        end:"end",
    },
};
Object.freeze(Placement);

export function createPopover({
    element, 
    target, 
    placements = {bottom:"middle", top:"middle", right:"middle", left:"middle"}, 
    modifiers = [], 
    boundaries = [],
    rootBoundary = "viewport",
}){

    const popover = new Popover();
    popover.setElement(element);
    popover.setTarget(target);
    popover.setPlacements(placements);
    popover.setModifiers(modifiers);
    popover.setBoundaries(boundaries);
    popover.setRootBoundary(rootBoundary);

    return popover;
}

class Popover {

    #target;
    #element;
    #boundaries = [];
    #rootBoundary = "viewport";
    #placements = {bottom:"middle", top:"middle", right:"middle", left:"middle"};
    #modifiers = [];
    #modifiersData = {};


    setElement(element){
        if(!(element instanceof Element)){
            throw new TypeError("Popover: element expected Element");
        }

        this.#element = element;
    }

    setTarget(target){
        if(typeof target.getBoundingClientRect != "function"){
            throw new TypeError("Popover: target expected having Function of getBoundingClientRect");
        }

        this.#target = target;
    }

    setBoundaries(boundaries){

        if(!Array.isArray(boundaries)){
            throw new TypeError("Popover: boundaries expected an array");
        }

        for(let i = 0; i < boundaries.length; i++){
            if(typeof boundaries[i].getBoundingClientRect != "function"){
                throw new TypeError(`Popover: boundaries[${i}] expected having Function of getBoundingClientRect`);
            }
        }

        this.#boundaries = boundaries;
    }

    setPlacements(placements){

        Object.entries(placements)
        .forEach((entry) => {

            if(!(entry[0] in Placement.mainAxis)){
                throw TypeError("Popover: placements expected mainAxis one of top, bottom, left, right");
            }
            if(!(entry[1] in Placement.crossAxis)){
                throw TypeError("Popover: placements expected crossAxis one of start, middle, end");
            }
        });

        this.#placements =  placements;
    }

    setModifiers(modifiers){

        if(!Array.isArray(modifiers)){
            throw new TypeError("Popover: modifiers expected Array<{name:String, options:Object}>")
        }
        
        modifiers.forEach((modifier) => {
            if(
                modifier == null || typeof modifier != "object" ||
                typeof modifier.name != "string" || 
                (typeof modifier.options !== "object" && typeof modifier.options !== "undefined")
            ){
                throw new TypeError("Popover: modifiers expected Array<{name:String, options:Object|Undefined}>");
            }
        })

        this.#modifiers = modifiers;
    }
    
    setRootBoundary(rootBoundary){
        if(!(rootBoundary === "viewport" || rootBoundary === "document")){
            throw new TypeError("Popover: rootBoundary expected String viewport or document");
        }

        this.#rootBoundary = String(rootBoundary);
    }

    destroy(){
        this.#element = null;
        this.#target = null;
        this.#placements = null;
        this.#boundaries = null;
        this.#rootBoundary = null;
        this.#modifiers = null;
    }

    prioritize(popoverRects, boundaryRect){

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

        return fittestPopboxRect;
    }

    getRootBoundary(){
        return this.#rootBoundary;
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
        return getClippedBoundaryRect([rootBoundaryElement, ...this.#boundaries]);
    }

    getTargetRect(){
        return this.#target.getBoundingClientRect();
    }

    getElementRect(){
        return this.#element.getBoundingClientRect();
    }

    //modifies popoverRect
    update(){

        const boundaryRect = this.getBoundaryRect();
        const targetRect = this.getTargetRect();
        const elementRect = this.getElementRect();

        for(let {name, options} of this.#modifiers){

            this.#modifiersData[name] = {};

            if(typeof Modifiers[name].before == "function"){
                Modifiers[name].before({
                    targetRect, 
                    boundaryRect,
                    options,
                    modifiersData: this.#modifiersData[name]
                });
            }
        }

        const popoverRects = [];

        for(let [mainAxis, crossAxis] of Object.entries(this.#placements)){
            
            const popoverRect = createPopoverRect({targetRect, elementRect, mainAxis, crossAxis});
            popoverRects.push(popoverRect);

            //ajusting
            for(let {name, options} of this.#modifiers){
                if(typeof Modifiers[name].modify == "function"){
                    Modifiers[name].modify({
                        targetRect, 
                        boundaryRect, 
                        popoverRect, 
                        options, 
                        modifiersData: this.#modifiersData[name]
                    });
                }
            }
        }

        //prioritizing
        const popoverRect = this.prioritize(popoverRects, boundaryRect);

        for(let {name, options} of this.#modifiers){
            if(typeof Modifiers[name].after == "function"){
                Modifiers[name].after({
                    targetRect, 
                    boundaryRect, 
                    popoverRect, 
                    element:this.#element, 
                    options, 
                    modifiersData: this.#modifiersData[name]
                });
            }
        }

        return {popoverRect, modifiersData:this.#modifiersData};
    }
}

export { Popover };