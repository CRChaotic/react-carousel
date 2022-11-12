
function getVirtualElement({x, y, width, height, clientWidth, clientHeight, clientLeft = 0, clientTop = 0}){

    const rect = DOMRect.fromRect({x, y, width, height});

    return {
        getBoundingClientRect:() =>  rect,
        clientWidth:clientWidth??width,
        clientHeight:clientHeight??height,
        clientLeft,
        clientTop,
    }
}

export {getVirtualElement};