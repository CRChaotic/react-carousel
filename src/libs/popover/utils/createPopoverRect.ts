import { getPopoverTranslations } from "./getPopoverTranslations";
import { MainAxis, CrossAxis, PopoverRect } from "./PopoverRect";

type Props = {
    targetRect:DOMRect;
    elementRect:DOMRect;
    mainAxis:MainAxis;
    crossAxis:CrossAxis;
}

export const createPopoverRect = ({targetRect, elementRect, mainAxis, crossAxis}:Props):PopoverRect => {

    const {translateX, translateY} = getPopoverTranslations({targetRect, elementRect, mainAxis, crossAxis});

    let privateWidth = elementRect.width;
    let privateHeight = elementRect.height;

    return {
        translateX,
        translateY,
        get x(){
            return elementRect.left + this.translateX;
        },
        get y(){
            return elementRect.top + this.translateY;
        },
        set x(x){
            this.translateX += Number(x) - this.x;
        },
        set y(y){
            this.translateY += Number(y) - this.y;
        },
        get left(){
            return this.x;
        },
        get top(){
            return this.y;
        },
        get width(){
            return privateWidth; 
        },
        set width(width){
            if(!isFinite(width) || width < 0){
                throw new RangeError("PopoverRect: width expected Number >= 0");
            }
            privateWidth = Number(width);
        },
        get height(){
            return privateHeight;
        },
        set height(height){
            if(!isFinite(height) || height < 0){
                throw new RangeError("PopoverRect: height expected Number >= 0");
            }
            privateHeight = Number(height);
        },
        get right(){
            return this.left + this.width;
        },
        get bottom(){
            return this.top + this.height;
        },
        get mainAxis(){
            return mainAxis;
        },
        get crossAxis(){
            return crossAxis;
        },
        toJSON() {
            return JSON.stringify(this);
        }
    };
}