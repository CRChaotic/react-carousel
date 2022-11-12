
export const offset =  {

    modify({popoverRect, options = {}}) {

        const {offset=[0, 0]} = options;
        
        switch(popoverRect.mainAxis){
            case "left":
                popoverRect.x -= offset[0];
                popoverRect.y += offset[1];
                break;
            case "right":
                popoverRect.x += offset[0];
                popoverRect.y += offset[1];
                break;
            case "top":
                popoverRect.y -= offset[0];
                popoverRect.x += offset[1];
                break;
            case "bottom":
                popoverRect.y += offset[0];
                popoverRect.x += offset[1];
                break;
            default:
                throw new TypeError("Modifier<offset>: mainAxis expected one of left,right,top,bottom");
        }

    }
}