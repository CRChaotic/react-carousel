import { useEffect, useRef, useState } from "react";

function useCollapsible({show = false, axis = "vertical", duration = 300}){

    const ref = useRef(null);
    const [size, setSize] = useState(0);

    useEffect(() => {
        const collapsible = ref.current;

        if(!(collapsible && show)){
            setSize(0);
           return;
        }

        let size = 0;
        if(axis === "vertical"){
            size = collapsible.scrollHeight+"px";
        }else if(axis === "horizontal"){
            size = collapsible.scrollWidth+"px";
        }

        setSize(size);

    },[show, axis]);

    let dimension = null;
    if(axis === "vertical"){
        dimension = "maxHeight";
    }else if(axis === "horizontal"){
        dimension = "maxWidth";
    }

    return {
        ref,
        style:{
            [dimension]: size,
            overflow: "hidden",
            transitionDuration: duration +"ms",
            transitionProperty:"max-width, max-height",
            padding:0,
            border:"none"
        }
    }
}

export default useCollapsible;