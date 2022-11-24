import { useState , useEffect} from "react";
import { computeStyles } from "../libs/popover/middlewares/computeStyles";
import { indicator } from "../libs/popover/middlewares/indicator";
import { offset } from "../libs/popover/middlewares/offset";
import { overflow } from "../libs/popover/middlewares/overflow";
import { getVirtualRectElement } from "../libs/popover/utils/getVirtualRectElement";
import { RectElement } from "../libs/popover/types";
import usePopover from "./usePopover";


export function PopoverTest(){

    const [target, setTarget] = useState<RectElement|null>(null);
    const [element, setElement] = useState<HTMLDivElement|null>(null);
    const [show, setShow] = useState(false);


    const modifiersData = usePopover(element, target, {
        modifiers:[
            {middleware:indicator},
            {middleware:computeStyles},
            {middleware:overflow, options:{margin:-16}},
            {middleware:offset, options:{offset:[7, 0]}}, 
        ],
    });

    const handlePointerOver = () => {
        setShow(true);
    }

    const handlePointerOut = () => {
        setShow(false);
    };

    useEffect(() => {

        const handleContextmenu = (e:MouseEvent) => {
            e.preventDefault();
            console.log(e);
         
            const ve = getVirtualRectElement({x:e.x, y:e.y, width:0, height:0});
            setTarget(ve);
            setShow(true);
        };

        window.addEventListener("contextmenu", handleContextmenu);

        return () => window.removeEventListener("contextmenu", handleContextmenu);
    }, []);


    return (
      <>
        <div 
            style={{border:"1px solid black", width:"300px", height:"300px", transform:"translate(00px, 00px)", marginLeft:"60%"}} 
            ref={setTarget} 
            onPointerOver={handlePointerOver} 
            onPointerOut={handlePointerOut}
        >
            target
        </div>
        {show &&
            <div 
                style={{ ...modifiersData.computeStyles}}  
                ref={setElement} 
                className="popover light"
            >
            tooltip
            <div style={{...modifiersData.indicator.styles}} {...modifiersData.indicator.attributes} data-popover-indicator></div>
            </div>
        }
      </>
    );
}
