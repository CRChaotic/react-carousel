import { CrossAxis, MainAxis } from "./PopoverRect";

const convertMainAxis = (mainAxis:MainAxis) => {
    if(mainAxis === "top" || mainAxis === "bottom"){
        return "vertical";
    }else {
        return "horizontal";
    }
};

type GetPopoverTranslations = {
    targetRect:DOMRect;
    elementRect:DOMRect;
    mainAxis:MainAxis;
    crossAxis:CrossAxis;
}

export const getPopoverTranslations = ({targetRect, elementRect, mainAxis, crossAxis}:GetPopoverTranslations) => {

    let translateX = 0;
    let translateY = 0;

    switch(convertMainAxis(mainAxis)){
        case "vertical":

            switch (mainAxis){
                case "top":
                    translateY = targetRect.top - elementRect.top - elementRect.height;
                    break;
                case "bottom":
                    translateY = targetRect.bottom - elementRect.top;
                    break;
                default:
                   throw new TypeError("getPopoverTranslations: mainAxis expected one of top, bottom, left, right");
            }

            switch (crossAxis){
                case "start":
                    translateX = targetRect.left - elementRect.left;
                    break;
                case "middle":
                    translateX = targetRect.left - elementRect.left + (targetRect.width - elementRect.width)/2;
                    break;
                case "end":
                    translateX = targetRect.right - elementRect.right;
                    break;
                default:
                    throw new TypeError("getPopoverTranslations: crossAxis expected one of start, middle, end");
            }

            break;
            

        case "horizontal":
            
            switch (mainAxis){
                case "left":
                    translateX = targetRect.left - elementRect.right;
                    break;
                case "right":
                    translateX = targetRect.right - elementRect.left;
                    break;
                default:
                    throw new TypeError("getPopoverTranslations: mainAxis expected one of top, bottom, left, right");
            }

            switch (crossAxis){
                case "start":
                    translateY = targetRect.top - elementRect.top;
                    break;
                case "middle":
                    translateY = targetRect.top - elementRect.top + (targetRect.height - elementRect.height)/2;
                    break;
                case "end":
                    translateY = targetRect.bottom - elementRect.bottom;
                    break;
                default:
                    throw new TypeError("getPopoverTranslations: crossAxis expected one of start, middle, end");
            }

            break;
        default:
            break;
    }

    return {translateX, translateY};
}