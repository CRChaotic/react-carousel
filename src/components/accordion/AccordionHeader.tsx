import { forwardRef, useContext } from "react";
import { AccordionItemContext } from "./AccordionItem";
import { AccordionContext } from "./Accordion";

import "./styles/./AccordionHeader.css";

const CLASS_NAME_HEADER = "accordion-header";
const CLASS_NAME_ACTIVE = "active";

const AccordionHeader = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>((props, ref) => {

    const itemKey = useContext(AccordionItemContext);
    const {hasItemKey, addItemKey, removeItemKey} = useContext(AccordionContext);
    const show = hasItemKey(itemKey);

    let className = [CLASS_NAME_HEADER];
    if(show){
        className.push(CLASS_NAME_ACTIVE);
    }
    if(props.className){
        className.push(props.className);
    }

    const handleClick = (e:React.PointerEvent<HTMLButtonElement>) => {
        if(show){
            removeItemKey(itemKey);
        }else{
            addItemKey(itemKey);
        }

        if(typeof props.onClick === "function"){
            props.onClick(e);
        }
    }

    return (
        <button {...props} ref={ref} type="button" className={className.join(" ")} onClick={handleClick}>
            {props.children}
        </button>
    );
});

AccordionHeader.displayName = "AccordionHeader";

export default AccordionHeader;