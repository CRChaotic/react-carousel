import { useEffect, useRef, useState } from "react";

interface useCollapsibleProps{
    show:boolean;
    axis?:"vertical"|"horizontal";
    duration?:number;
}

function useCollapsible<T extends HTMLElement>({
    show = false, 
    axis = "vertical", 
    duration = 300
}:useCollapsibleProps):{ref:React.RefObject<T>; style:React.CSSProperties} {

    const ref = useRef<T>(null);
    const [size, setSize] = useState(0);

    useEffect(() => {
        const collapsible = ref.current;

        if(!(collapsible && show)){
            setSize(0);
           return;
        }

        let size = 0;
        if(axis === "vertical"){
            size = collapsible.scrollHeight;
        }else if(axis === "horizontal"){
            size = collapsible.scrollWidth;
        }

        setSize(size);

    },[show, axis]);

    let dimension = "";
    if(axis === "vertical"){
        dimension = "maxHeight";
    }else if(axis === "horizontal"){
        dimension = "maxWidth";
    }

    return {
        ref,
        style:{
            [dimension]: size + "px",
            overflow: "hidden",
            transitionDuration: duration +"ms",
            transitionProperty:"max-width, max-height",
            padding:0,
            border:"none"
        }
    };
}

export default useCollapsible;