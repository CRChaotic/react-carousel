import { Middleware } from "../types";

export type OffsetOptions = {
    main:number;
    cross:number;
}

export const offset = (options:OffsetOptions):Middleware => ({
    name:"offset",
    modify({popoverRect}) {

        const {main, cross} = options;
        
        switch(popoverRect.mainAxis){
            case "left":
                popoverRect.x -= main;
                popoverRect.y += cross;
                break;
            case "right":
                popoverRect.x += main;
                popoverRect.y += cross;
                break;
            case "top":
                popoverRect.y -= main;
                popoverRect.x += cross;
                break;
            case "bottom":
                popoverRect.y += main;
                popoverRect.x += cross;
                break;
            default:
                throw new TypeError("Modifier<offset>: mainAxis expected one of left,right,top,bottom");
        }

    }
});