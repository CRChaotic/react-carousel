
let viewportRectChanged = true;
let viewportRectMemo = new DOMRect();

if(!window.visualViewport){
    window.addEventListener("resize", () => {
        if(viewportRectChanged){
            return;
        }
        viewportRectChanged = true;
    });
}

window.visualViewport?.addEventListener("resize", () => {
    if(viewportRectChanged){
        return;
    }
    viewportRectChanged = true;
});

window.visualViewport?.addEventListener('scroll', () => {
    if(viewportRectChanged){
        return;
    }

    viewportRectChanged = true;
}, {passive:true});


function getViewportRect(){

    if(viewportRectChanged){
        const viewportRect = window.visualViewport;

        let x = 0;
        let y = 0;
        let width = 0;
        let height = 0;
        if(viewportRect){
            x = viewportRect.offsetLeft;
            y = viewportRect.offsetTop;
            width = viewportRect.width;
            height = viewportRect.height;
        }else{
            width = document.documentElement.clientWidth;
            height = document.documentElement.clientHeight;
        }

        viewportRectMemo = DOMRect.fromRect({x, y, width, height});
        viewportRectChanged = false;
    
        console.warn("viewport watch out:");
    }
   
    return viewportRectMemo;
}

export { getViewportRect };