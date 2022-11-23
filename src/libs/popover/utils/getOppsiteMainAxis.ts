import { MainAxis } from "./PopoverRect";

export const getOppsiteMainAxis = (axis:MainAxis):MainAxis => {
    let oppsiteMainAxis= "" as MainAxis; 
    switch(axis){
        case "left":
            oppsiteMainAxis = "right";
            break;
        case "right":
            oppsiteMainAxis = "left";
            break;
        case "top":
            oppsiteMainAxis = "bottom";
            break;
        case "bottom":
            oppsiteMainAxis = "top";
            break;
        default:
            throw new TypeError("axis expected one of top, bottom, left, right");
    }
    return oppsiteMainAxis;
};