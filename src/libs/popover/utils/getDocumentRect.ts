import { getViewportRect } from "./getViewportRect";

let documentRectChanged = true;
let documentRectMemo = new DOMRect();

const resizeObserver = new ResizeObserver((entries) => {
    if(documentRectChanged){
        return;
    }

    if(entries.find((entry) => entry.target === document.body)){
        documentRectChanged = true;
    }
})
resizeObserver.observe(document.body);

window.addEventListener("scroll", () => {
    if(documentRectChanged){
        return;
    }
    
    documentRectChanged = true;
}, {passive:true});

function getDocumentRect(){
    
    if(documentRectChanged){
        documentRectMemo = document.body.getBoundingClientRect();
        console.log(document.body.scrollHeight, document.body.scrollWidth)
        documentRectChanged = false;
        console.warn("document watch out");
    }

    const viewportRect = getViewportRect();
    //fix when document is smaller than viewport
    documentRectMemo.width = Math.max(documentRectMemo.width, viewportRect.width);
    documentRectMemo.height = Math.max(documentRectMemo.height, viewportRect.height);

    return documentRectMemo;
}

export { getDocumentRect };