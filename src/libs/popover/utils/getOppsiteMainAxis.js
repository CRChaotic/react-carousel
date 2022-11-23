export const getOppsiteMainAxis = (axis) => {
    let oppsiteMainAxis = ""; 
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
            break;
    }
    return oppsiteMainAxis;
};