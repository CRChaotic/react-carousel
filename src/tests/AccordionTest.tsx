import Accordion from "../components/accordion/Accordion";
import AccordionBody from "../components/accordion/AccordionBody";
import AccordionHeader from "../components/accordion/AccordionHeader";
import AccordionItem from "../components/accordion/AccordionItem";


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