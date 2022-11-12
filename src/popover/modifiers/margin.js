
export const margin = {

    before({boundaryRect, options = {}}){

        let left=0, right=0, top=0, bottom=0;
        const { margin } = options;
        
        if(typeof margin === "number"){
            left = margin;
            right = margin;
            top = margin;
            bottom = margin;
        }else if(typeof margin === "object" && margin != null){
            left = isFinite(Number(margin.left)) ? Number(margin.left):0;
            right = isFinite(Number(margin.right)) ? Number(margin.right):0;
            top = isFinite(Number(margin.top)) ? Number(margin.top):0;
            bottom = isFinite(Number(margin.bottom)) ? Number(margin.bottom):0;

        }else{
            throw new TypeError("Modifier<margin>: margin expected a Number or an Object");
        }

        boundaryRect.x += -left;
        boundaryRect.y += -top;
        boundaryRect.width += left + right;
        boundaryRect.height += top + bottom;
    }
};

