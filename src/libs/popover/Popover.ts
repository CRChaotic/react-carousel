import { Middleware, MiddlewareData, Placement, RootBoundary } from "./types";
import { createPopoverRect } from "./utils/createPopoverRect";
import { getClippedBoundaryRect } from "./utils/getClippedBoundaryRect";
import { getDocumentRect } from "./utils/getDocumentRect";
import { getOverlapRect } from "./utils/getOverlap"
import { getViewportRect } from "./utils/getViewportRect";
import { getVirtualRectElement } from "./utils/getVirtualRectElement";
import { PopoverRect, RectElement } from "./types";

import "./styles/Popover.css";

class Popover {

    element:HTMLElement;
    target:RectElement;
    placements:Placement[];
    middlewares: Middleware[];
    boundaries: RectElement[];
    rootBoundary: RootBoundary;
    middlewareData: MiddlewareData;

    constructor(element:HTMLElement, target:RectElement){
        this.element = element;
        this.target = target;
        this.placements = [
            {mainAxis:"bottom", crossAxis:"middle"},
            {mainAxis:"top", crossAxis:"middle"},
            {mainAxis:"right", crossAxis:"middle"},
            {mainAxis:"left", crossAxis:"middle"},
        ];
        this.middlewares = [];
        this.boundaries = [];
        this.rootBoundary = "viewport";
        this.middlewareData = {};
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

    getRootBoundaryRect():DOMRect{
        if(this.getRootBoundary() === "viewport"){
            return getViewportRect();
        }else {
            return getDocumentRect();
        }
    }

    getBoundaryRect(){
        const rootBoundaryElement = getVirtualRectElement(this.getRootBoundaryRect());
        return getClippedBoundaryRect([rootBoundaryElement, ...this.boundaries])!;
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

        for(let middleware of this.middlewares){
            const name = middleware.name;
            this.middlewareData[name] = {};

            if(middleware.before){
                middleware.before({
                    targetRect, 
                    boundaryRect,
                    elementRect,
                    element:this.element,
                    middlewareData: this.middlewareData[name]
                });
            }
            
        }

        const popoverRects = [];

        for(let {mainAxis, crossAxis} of this.placements){
            
            const popoverRect = createPopoverRect({targetRect, elementRect, mainAxis, crossAxis});
            popoverRects.push(popoverRect);

            //ajusting
            for(let middleware of this.middlewares){

                const name = middleware.name;
  
                if(middleware.modify){
                    middleware.modify({
                        targetRect, 
                        boundaryRect,
                        elementRect,
                        element:this.element,
                        popoverRect, 
                        middlewareData: this.middlewareData[name]
                    });
                }

            }
        }

        //prioritizing
        const popoverRect = this.prioritize(popoverRects, boundaryRect);

        for(let middleware of this.middlewares){
            const name = middleware.name;

            if(middleware.after){
                middleware.after({
                    targetRect, 
                    boundaryRect, 
                    popoverRect,
                    elementRect,
                    element:this.element,
                    middlewareData: this.middlewareData[name]
                });
            }
        }

        return {popoverRect, middlewareData:this.middlewareData};
    }
}

export default Popover;