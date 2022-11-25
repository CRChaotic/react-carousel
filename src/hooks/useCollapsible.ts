import React, { useState } from "react";

export interface useCollapsibleProps{
    show:boolean;
    axis?:"vertical"|"horizontal";
    duration?:number;
}

type useCollapsibleState<T> = {
    ref:React.Dispatch<React.SetStateAction<T|null>>;
    style:React.CSSProperties;
}

function useCollapsible<T extends HTMLElement>({
    show = false, 
    axis = "vertical", 
    duration = 300
}:useCollapsibleProps):useCollapsibleState<T> {

    const [collapsible, setCollapsible] = useState<T|null>(null);
    let size = 0;

    if(collapsible && show){
        if(axis === "vertical"){
            size = collapsible.scrollHeight;
        }else if(axis === "horizontal"){
            size = collapsible.scrollWidth;
        }
    }

    let dimension = "";
    if(axis === "vertical"){
        dimension = "height";
    }else if(axis === "horizontal"){
        dimension = "width";
    }

    return {
        ref:setCollapsible,
        style:{
            [dimension]: size + "px",
            overflow: "hidden",
            transitionDuration: duration +"ms",
            transitionProperty:"width, height",
            padding:0,
            border:"none"
        }
    };
}

export default useCollapsible;