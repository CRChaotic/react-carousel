import { createContext, forwardRef, useState } from "react";

import "./styles/Accordion.css";

const CLASS_NAME_ACCORDION = "accordion";

const AccordionContext = createContext(null);

const Accordion = forwardRef(({maxOpen=Infinity, children, ...props}, ref) => {

    const [itemkeys, setItemkeys] = useState([]);

    const addItemKey = (itemKey) => {
        if(itemkeys.includes(itemKey)){
            return;
        }

        const newItemKeys = [itemKey, ...itemkeys];
        if(newItemKeys.length > maxOpen){
            newItemKeys.pop();
        }
        if(newItemKeys.length === 0){
            return;
        }
        setItemkeys(newItemKeys);
    };

    const removeItemKey = (itemKey) => {
        setItemkeys(itemkeys.filter((key) => key !== itemKey));
    };

    const hasItemKey = (itemkey) => {
        return itemkeys.includes(itemkey);
    };

    let className = props.className ? CLASS_NAME_ACCORDION + " "+ props.className : CLASS_NAME_ACCORDION;

    return (
        <AccordionContext.Provider value={{hasItemKey, addItemKey, removeItemKey}}>
            <div {...props} ref={ref} className={className}>
                {children}            
            </div>
        </AccordionContext.Provider>
    );
});

export { AccordionContext };
export default Accordion;