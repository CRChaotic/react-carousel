import { createContext, forwardRef } from "react";
import { ItemKey } from "./Accordion";

import "./styles/AccordionItem.css";

const CLASS_NAME_ITEM = "accordion-item";

export interface AccordionItemProps extends React.ComponentPropsWithoutRef<"div">{
    itemKey:ItemKey;
}

const AccordionItemContext = createContext<ItemKey>(null!);

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(({
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

AccordionItem.displayName = "AccordionItem";

export { AccordionItemContext };
export default AccordionItem;