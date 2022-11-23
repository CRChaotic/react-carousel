
const calculateOverlapRect  = (aRect ,bRect) => {
    let top = Math.max(aRect.top, bRect.top);
    let bottom = Math.min(aRect.bottom, bRect.bottom);
    let left = Math.max(aRect.left, bRect.left);
    let right = Math.min(aRect.right, bRect.right);
    let width = right - left;
    let height = bottom - top;

    return DOMRect.fromRect({ 
        x: left, 
        y: top, 
        width, 
        height,
    });
}

//TO DO
const getOverlapRect = (targetRect, ...rects) => {

    let overlapRect = targetRect;
    let overlapArea = targetRect.width*targetRect.height;

    for(let rect of rects){
        overlapRect = calculateOverlapRect(targetRect, rect);
        overlapArea = Math.max(overlapRect.width,0) * Math.max(overlapRect.height,0);
        targetRect = overlapRect;

        if(overlapArea === 0){
            break;
        }
    }

    return overlapRect;
};

export {getOverlapRect};