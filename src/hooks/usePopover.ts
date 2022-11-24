import { useEffect, useMemo, useState } from "react";
import { computeStyles } from "../libs/popover/middlewares/computeStyles";
import { offset } from "../libs/popover/middlewares/offset";
import Popover from "../libs/popover/Popover";
import { MiddlewareConfig, Placement, RootBoundary } from "../libs/popover/types";
import { RectElement } from "../libs/popover/types";

import useObjectDependency from "./useObjectDependency";

interface UsePopoverProps{
    modifiers?:MiddlewareConfig[];
    placements?:Placement[];
    rootBoundary?:RootBoundary;
    boundaries?: RectElement[];
}

function usePopover(
    element:HTMLElement|null, 
    target:RectElement|null, 
    {
        modifiers = [{middleware:computeStyles}, {middleware:offset, options:{offset:[7, 0]}}], 
        placements, 
        rootBoundary,
        boundaries,
    }:UsePopoverProps = {}
){

    const currentPlacements = useObjectDependency(placements);
    const currentMiddlewares = useObjectDependency(modifiers);
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

        for(let config of currentMiddlewares??[]){
            popoverState[config.middleware.name]= {};
        }

        if(element && target && updateTime){

            let popover:Popover|null = new Popover(element, target);

            if(currentPlacements){
                popover.placements = currentPlacements;
            }
            if(currentMiddlewares){
                popover.middlewares = currentMiddlewares;
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

    }, [element, target, currentMiddlewares, currentPlacements, rootBoundary, boundaries, updateTime]);


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
