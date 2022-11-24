import { useEffect, useMemo, useState } from "react";
import { computeStyles } from "../libs/popover/middlewares/computeStyles";
import { indicator, IndicatorOptions } from "../libs/popover/middlewares/indicator";
import { margin, MarginOptions } from "../libs/popover/middlewares/margin";
import { offset, OffsetOptions } from "../libs/popover/middlewares/offset";
import { overflow, OverflowOptions } from "../libs/popover/middlewares/overflow";
import Popover from "../libs/popover/Popover";
import { Placement, RootBoundary } from "../libs/popover/types";
import { RectElement } from "../libs/popover/types";
import useObjectDependency from "./useObjectDependency";


export type MiddlewareConfig = 
{
    name: "offset";
    options:OffsetOptions;
}
|{
    name:"computeStyles";
}
|{
    name:"indicator";
    options?:IndicatorOptions;
}
|{
    name:"margin";
    options:MarginOptions;
}
|{
    name:"overflow";
    options?:OverflowOptions
}

export interface UsePopoverProps{
    modifiers?:MiddlewareConfig[];
    placements?:Placement[];
    rootBoundary?:RootBoundary;
    boundaries?: RectElement[];
}

function usePopover(
    element:HTMLElement|null, 
    target:RectElement|null, 
    {
        modifiers = [
            {name:"computeStyles"}, 
            {name:"overflow"}, 
            {name:"offset", options:{main:6, cross:0}}
        ], 
        placements, 
        rootBoundary,
        boundaries,
    }:UsePopoverProps = {}
){

    const currentPlacements = useObjectDependency(placements);
    const currentModifiers = useObjectDependency(modifiers);
    const [updateTime, setUpdateTime] = useState<number|null>(1);

    const popoverMemo = useMemo(() => {
    
        let popoverState:{[k:string]:any} = {
            popoverRect:{},
            onForceUpdate: () => {
                if(!(element && target)){
                    return;
                }
        
                setUpdateTime(document.timeline.currentTime);
            }
        };

        for(let modifier of currentModifiers??[]){
            popoverState[modifier.name]= {};
        }

        if(element && target && updateTime){

            let popover:Popover|null = new Popover(element, target);

            if(currentPlacements){
                popover.placements = currentPlacements;
            }
            if(currentModifiers){


                popover.middlewares = currentModifiers.map((modifier) => {

                    switch(modifier.name){
                        case "computeStyles":
                            return computeStyles();
                        case "overflow":
                            return overflow(modifier.options);
                        case "indicator":
                            return indicator(modifier.options);
                        case "offset":
                            return offset(modifier.options);
                        case "margin":
                            return margin(modifier.options);
                        default:
                            throw new TypeError("Modifier name expected one of computeStyles, overflow, indicator, offset, margin"); 
                    }

                });
            }
            if(boundaries){
                popover.boundaries = boundaries;
            }
            if(rootBoundary){
                popover.rootBoundary = rootBoundary;
            }
            console.warn("update");
            const {popoverRect, middlewareData} = popover.update();
            popover = null;
    
            popoverState.popoverRect = popoverRect
            for(let modifierName in middlewareData){
                popoverState[modifierName] = middlewareData[modifierName];
            }
        }

        return popoverState;

    }, [element, target, currentModifiers, currentPlacements, rootBoundary, boundaries, updateTime]);

    //dealing with changed orientation
    useEffect(() => {
        if(!(element && target)){
            return;
        }

        const handleUpdate = () => {
            setUpdateTime(document.timeline.currentTime);
            console.info("resized need to update");
        };

        window.addEventListener("resize", handleUpdate);

        return () => {
            window.removeEventListener("resize", handleUpdate);
        };

    }, [element, target, rootBoundary]);

    return popoverMemo;
}

export default usePopover;
