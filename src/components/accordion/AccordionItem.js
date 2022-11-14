import { createContext, forwardRef } from "react";

import "./styles/AccordionItem.css";

const CLASS_NAME_ITEM = "accordion-item";

const AccordionItemContext = createContext(null);

const AccordionItem = forwardRef(({
    itemKey,
    children,
    ...props
}, ref) => {

    let className = props.className ? CLASS_NAME_ITEM + " " +props.className : CLASS_NAME_ITEM;

    return (
        <AccordionItemContext.Provider value={itemKey}>
            <div {...props} ref={ref} className={className} >
                {children}
            </div>
        </AccordionItemContext.Provider>
    );
});

export { AccordionItemContext };
export default AccordionItem;