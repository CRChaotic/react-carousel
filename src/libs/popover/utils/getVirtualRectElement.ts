import { RectElement } from "./RectElement";

type GetVirtualRectElement = {
    x:number;
    y:number;
    width:number;
    height:number;
    clientWidth?:number; 
    clientHeight?:number; 
    clientLeft?:number; 
    clientTop?:number;
}

function getVirtualRectElement({
    x, 
    y, 
    width, 
    height, 
    clientWidth, 
    clientHeight, 
    clientLeft = 0, 
    clientTop = 0
}:GetVirtualRectElement):RectElement{

    const rect = DOMRect.fromRect({x, y, width, height});

    return {
        clientWidth:clientWidth??width,
        clientHeight:clientHeight??height,
        clientLeft,
        clientTop,
        getBoundingClientRect:() =>  rect,
    }
}

export {getVirtualRectElement};