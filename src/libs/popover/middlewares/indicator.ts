import { getPaddedRect } from "../utils/getPaddedRect";
import { getOppsiteMainAxis } from "../utils/getOppsiteMainAxis";
import { getPopoverTranslations } from "../utils/getPopoverTranslations";
import { Middleware } from "../types";

const SELECTOR_INDICATOR = "[data-popover-indicator]";
const CROSS_AXIS_PLACEMENT = "middle";

export type IndicatorOptions = {
    indicatorElement:HTMLElement;
}

export const indicator = (options?:IndicatorOptions):Middleware => ({
    name:"indicator",
    after({targetRect, popoverRect, element:popElement, middlewareData}){

        const indicatorElement = options?.indicatorElement??popElement.querySelector(SELECTOR_INDICATOR);
        if(!(indicatorElement instanceof Element)){
            throw new TypeError("Modifier<Indicator>: element expected Element");
        }

        let clippedTop = 0, clippedBottom = 0, clippedLeft = 0, clippedRight = 0;
        const mainAxis = popoverRect.mainAxis;

        if(mainAxis === "left" || mainAxis === "right"){
            clippedTop = popoverRect.top < targetRect.top ? popoverRect.top - targetRect.top : 0;
            clippedBottom = popoverRect.bottom > targetRect.bottom ? targetRect.bottom - popoverRect.bottom : 0;
        }else if(mainAxis === "top" || mainAxis === "bottom"){
            clippedLeft = popoverRect.left < targetRect.left ? popoverRect.left - targetRect.left : 0;
            clippedRight = popoverRect.right > targetRect.right ? targetRect.right - popoverRect.right : 0;
        }
        

        const clippedPopoverRect = getPaddedRect(popoverRect, {left: clippedLeft, right:clippedRight, top:clippedTop, bottom: clippedBottom});


        const {x, y, width, height} = indicatorElement.getBoundingClientRect();
        const indicatorRect = DOMRect.fromRect({x: popoverRect.x, y: popoverRect.y, width, height});

        const {translateX, translateY} = getPopoverTranslations({
            targetRect: clippedPopoverRect, 
            elementRect: indicatorRect, 
            mainAxis: getOppsiteMainAxis(popoverRect.mainAxis),
            crossAxis: CROSS_AXIS_PLACEMENT,
        });

        middlewareData.styles = {transform:`translate3d(${translateX}px, ${translateY}px, 0)`};
        middlewareData.attributes = {
            "data-main-axis":popoverRect.mainAxis, 
            "data-cross-axis":popoverRect.crossAxis,
            "data-popover-indicator":true
        };
        middlewareData.rect = {translateX, translateY, x, y, width, height, left:x, top:y, right:x+width, bottom:y+height};
    }
});

