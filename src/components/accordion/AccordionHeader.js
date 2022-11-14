import { forwardRef, useContext } from "react";
import { AccordionItemContext } from "./AccordionItem";
import { AccordionContext } from "./Accordion";

import "./styles/./AccordionHeader.css";

const CLASS_NAME_HEADER = "accordion-header";
const CLASS_NAME_ACTIVE = "active";

const AccordionHeader = forwardRef((props, ref) => {

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

    const handleClick = (e) => {
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

export default AccordionHeader;