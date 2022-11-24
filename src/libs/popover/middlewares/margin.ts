import { Middleware } from "../types";

export type MarginOptions = {
    margin:number | {left:number; right:number; top:number; bottom:number;}
}


export const margin = (options:MarginOptions):Middleware => ({
    name:"margin",
    before({boundaryRect}){

        let left=0, right=0, top=0, bottom=0;
        const margin = options.margin;
        if(typeof margin === "number"){
            left = margin;
            right = margin;
            top = margin;
            bottom = margin;
        }else{
            left = isFinite(margin.left) ? margin.left:0;
            right = isFinite(margin.right) ? margin.right:0;
            top = isFinite(margin.top) ? margin.top:0;
            bottom = isFinite(margin.bottom) ? margin.bottom:0;
        }

        boundaryRect.x += -left;
        boundaryRect.y += -top;
        boundaryRect.width += left + right;
        boundaryRect.height += top + bottom;
    }
});

