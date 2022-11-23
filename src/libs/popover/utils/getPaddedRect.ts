
export const getPaddedRect = (rect:DOMRect, {left=0, right=0, top=0, bottom=0} = {}) => {
    return DOMRect.fromRect({
        x: rect.x - left, 
        y: rect.y - top, 
        width:rect.width + left + right, 
        height: rect.height + top + bottom,
    });
}