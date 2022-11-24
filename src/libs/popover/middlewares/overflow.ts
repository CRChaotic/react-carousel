import { getPaddedRect } from "../utils/getPaddedRect";
import { Middleware } from "../types";

export type OverflowOptions = {
    margin:number | {left:number; right:number; top:number; bottom:number;}
}

export const overflow = (options?:OverflowOptions):Middleware => ({
    name:"overflow",
    modify({targetRect, boundaryRect, popoverRect}) {

        let margin = options?.margin??0;

        if(typeof margin === "number"){
            margin = {
                left: margin,
                right: margin,
                top: margin,
                bottom: margin
            };
        }

        const clippedTargetRect = getPaddedRect(targetRect, margin);
    
        if(popoverRect.mainAxis === "left" || popoverRect.mainAxis === "right"){
    
            if(popoverRect.bottom > boundaryRect.bottom){
                const maxShift = Math.abs(clippedTargetRect.top - popoverRect.bottom);
                const shift = Math.abs(boundaryRect.bottom - popoverRect.bottom);
    
                popoverRect.y -= shift > maxShift ? maxShift : shift;
            }
    
            if(popoverRect.top < boundaryRect.top){
                const maxShift =  Math.abs(clippedTargetRect.bottom - popoverRect.top);
                const shift = Math.abs(boundaryRect.top - popoverRect.top);
    
                popoverRect.y += shift > maxShift ? maxShift : shift;
            }
    
        }else if(popoverRect.mainAxis === "top" || popoverRect.mainAxis === "bottom"){
    
            if(popoverRect.right > boundaryRect.right){
                const maxShift = Math.abs(popoverRect.right - clippedTargetRect.left);
                const shift = Math.abs(popoverRect.right -boundaryRect.right);
    
                popoverRect.x -= shift > maxShift ? maxShift : shift;
            }
    
            if(popoverRect.left < boundaryRect.left){
                const maxShift = Math.abs(popoverRect.left - clippedTargetRect.right);
                const shift = Math.abs(popoverRect.left -  boundaryRect.left);
    
                popoverRect.x += shift > maxShift ? maxShift: shift;
            }
        }
    }
});