import { createContext, forwardRef, useState } from "react";

import "./styles/Accordion.css";

const CLASS_NAME_ACCORDION = "accordion";

interface AccordionProps extends React.ComponentPropsWithoutRef<"div">{
    maxOpen?:number;
}

export type ItemKey = string|number;

export interface AccordionContextInterface{
    hasItemKey:(itemKey:ItemKey) => boolean;
    addItemKey:(itemKey:ItemKey) => void;
    removeItemKey:(itemKey:ItemKey) => void;
}

export const AccordionContext = createContext<AccordionContextInterface>(null!);

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(({maxOpen=Infinity, children, ...props}, ref) => {

    const [itemkeys, setItemkeys] = useState<ItemKey[]>([]);

    const addItemKey = (itemKey:ItemKey) => {
        if(itemkeys.includes(itemKey)){
            return;
        }

        let newItemKeys = [itemKey, ...itemkeys];
        if(newItemKeys.length > maxOpen){
            newItemKeys = newItemKeys.slice(0, maxOpen);
        }
        if(newItemKeys.length === 0){
            return;
        }
        setItemkeys(newItemKeys);
    };

    const removeItemKey = (itemKey:ItemKey) => {
        setItemkeys(itemkeys.filter((key) => key !== itemKey));
    };

    const hasItemKey = (itemkey:ItemKey) => {
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

Accordion.displayName = "Accordion";

export default Accordion;