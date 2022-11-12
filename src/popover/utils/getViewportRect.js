
let viewportRectChanged = true;
let viewportRectMemo = null;


window.visualViewport.addEventListener("resize", () => {
    if(viewportRectChanged){
        return;
    }
    viewportRectChanged = true;
});

window.visualViewport.addEventListener('scroll', () => {
    if(viewportRectChanged){
        return;
    }

    viewportRectChanged = true;
}, {passive:true});


function getViewportRect(){

    if(viewportRectChanged){
        const viewportRect = window.visualViewport;
        const width = viewportRect.width;
        const height = viewportRect.height;

        viewportRectMemo = DOMRect.fromRect({x:viewportRect.offsetLeft, y:viewportRect.offsetTop, width, height});
        viewportRectChanged = false;
        console.warn("viewport watch out");
    }
   
    return viewportRectMemo;
}

export { getViewportRect };