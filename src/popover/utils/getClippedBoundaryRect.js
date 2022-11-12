import { getOverlapRect } from "./getOverlap";

function getClippedBoundaryRect(boundaries){

    let clippedBoundaryRect = null;

    for(let boundary of boundaries){
        const rect = boundary.getBoundingClientRect();
        const clientLeft = boundary.clientLeft;
        const clientTop = boundary.clientTop;
        const clientWidth = boundary.clientWidth;
        const clientHeight = boundary.clientHeight;

        const boundaryRect = DOMRect.fromRect({
            x: rect.left + clientLeft, 
            y: rect.top + clientTop, 
            width: clientWidth, 
            height: clientHeight
        });

        if(clippedBoundaryRect == null){
            clippedBoundaryRect = boundaryRect;
        }else{
            clippedBoundaryRect = getOverlapRect(clippedBoundaryRect, boundaryRect);
        }
    }

    return clippedBoundaryRect;
}


export { getClippedBoundaryRect };
