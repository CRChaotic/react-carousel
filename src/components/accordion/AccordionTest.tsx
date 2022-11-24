import Accordion from "./Accordion";
import AccordionBody from "./AccordionBody";
import AccordionHeader from "./AccordionHeader";
import AccordionItem from "./AccordionItem";


function AccordionTest(){

    return (
        <>
            <Accordion maxOpen={1} style={{border:"1px solid rgb(200, 200, 200)", borderRadius:"5px"}}>
                <AccordionItem key={0} itemKey={0}>
                    <AccordionHeader>item1 header</AccordionHeader>
                    <AccordionBody>item1 body</AccordionBody>
                </AccordionItem>
                <AccordionItem key={1} itemKey={1}>
                    <AccordionHeader>item2 header</AccordionHeader>
                    <AccordionBody>item2 body</AccordionBody>
                </AccordionItem>
                <AccordionItem key={2} itemKey={2}>
                    <AccordionHeader>item3 header</AccordionHeader>
                    <AccordionBody>item3 body</AccordionBody>
                </AccordionItem>
            </Accordion>

        </>
    );
}

export { AccordionTest };