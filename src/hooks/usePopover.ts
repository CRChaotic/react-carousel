import { useEffect, useMemo, useState } from "react";
import { computeStyles } from "../libs/popover/modifiers/computeStyles";
import { offset } from "../libs/popover/modifiers/offset";
import Popover, { ModifierConfig, Placement, RootBoundary } from "../libs/popover/Popover";
import { RectElement } from "../libs/popover/utils/RectElement";

import useObjectDependency from "./useObjectDependency";

interface UsePopoverProps{
    modifiers?:ModifierConfig[];
    placements?:Placement[];
    rootBoundary?:RootBoundary;
    boundaries?: RectElement[];
}

function usePopover(
    element:HTMLElement|null, 
    target:RectElement|null, 
    {
        modifiers = [{modifier:computeStyles}, {modifier:offset, options:{offset:[7, 0]}}], 
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

        for(let config of currentModifiers??[]){
            popoverState[config.modifier.name]= {};
        }

        if(element && target && updateTime){

            let popover:Popover|null = new Popover(element, target);

            if(currentPlacements){
                popover.placements = currentPlacements;
            }
            if(currentModifiers){
                popover.modifiers = currentModifiers;
            }
            if(boundaries){
                popover.boundaries = boundaries;
            }
            if(rootBoundary){
                popover.rootBoundary = rootBoundary;
            }
            console.warn("update");
            const {popoverRect, modifiersData} = popover.update();
            popover = null;
    
            popoverState.popoverRect = popoverRect
            for(let modifierName in modifiersData){
                popoverState[modifierName] = modifiersData[modifierName];
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
