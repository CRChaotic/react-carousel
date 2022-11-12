
const regExp = /translate3d\(\s*(?<x>[^,\s]*)\s*,\s*(?<y>[^,\s]*)\s*,\s*(?<z>[^,\s]*)\s*\)/;

const computeStyles = {
    after({popoverRect, element, modifiersData}){
       
        const elementTransform = element.style.transform;
        let replaced = false;

        let transform = elementTransform.replace(regExp, (match, x, y, z) => {
            replaced = true;
            return `translate3d(calc(${x} + ${popoverRect.translateX}px), calc(${y} + ${popoverRect.translateY}px), ${z})`;
        });

        if(!replaced){
            transform = `translate3d(${popoverRect.translateX}px, ${popoverRect.translateY}px, 0px) ${elementTransform}`;
        }

        modifiersData.transform =  transform;
    }
}

export {computeStyles};