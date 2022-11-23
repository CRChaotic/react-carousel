
const regExp = /translate3d\(([^,]*),([^,]*),([^,]*?)\)/;

type TranslateElement = {
    element:HTMLElement;
    translateX:number;
    translateY:number;
}

export const translateElement = ({element, translateX, translateY}:TranslateElement) => {
    if(!regExp.test(element.style.transform)){
        element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0px) ${element.style.transform}`;
    }else{
        element.style.transform = element.style.transform.replace(regExp, `translate3d(calc($1 + ${translateX}px), calc($2 + ${translateY}px), 0px)`);
    }
}
