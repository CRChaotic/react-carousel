
export type MainAxis = "top"|"bottom"|"left"|"right";
export type CrossAxis = "start"|"middle"|"end";

export interface PopoverRect{
    translateX:number;
    translateY:number;
    x:number;
    y:number;
    readonly left:number;
    readonly right:number;
    readonly bottom:number;
    readonly top:number;
    width:number;
    height:number;
    readonly mainAxis:MainAxis;
    readonly crossAxis:CrossAxis;
}
