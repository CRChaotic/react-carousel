# Typescript rewrited react-components
Typescript+React
- [Carousel](#carousel-example)
- [Accordion](#accordion-example)
- [Router](#router-example)
- [useCollapsible](#usecollapsible-hook-example)
- [usePopover](#usepopover-hook-example)

## Carousel example
```JS
const items = [
    <div key={0} style={{width:"100%", height:"100%", backgroundColor:"purple"}}>item1</div>,
    <div key={1} style={{width:"100%", height:"100%", backgroundColor:"yellowgreen"}}>item2</div>,
    <div key={2} style={{width:"100%", height:"100%", backgroundColor:"blue"}}>item3</div>,
];

function CarouselTest(){

    const hanldeSwitchStart = useCallback((next:number, direction:string) => {
        console.log("start next:", next, direction);
    }, []);

    const hanldeSwitchEnd = useCallback((prev:number) => {
        console.log("end");
    }, []);

    return (
        <Carousel
            items={items} 
            style={{width:"80%", height:"500px"}} 
            animation="slide"
            interval={3500} 
            onSwitchStart={hanldeSwitchStart}
            onSwitchEnd={hanldeSwitchEnd}
        >
            <CarouselButton placement="left"></CarouselButton>
            <CarouselButton placement="right"></CarouselButton>
            <CarouselIndicator/>
        </Carousel>
    );
}
```

## Accordion example
```JS
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
```

## Router example
```JS
function Thoughts(){

    const {currentRoute} = useContext(RouterContext);

    return (
        <>
            <h1>
                Thoughts, id:{currentRoute.var.id}<br/>
                by {currentRoute.var.name}<br/>
            </h1>
            <p>
                search:{currentRoute.param.topic}<br/>
                msg:{currentRoute.param.msg}
            </p>
            <Link href="/thoughts/^[">thoughts</Link><br/>
        </>
    );
}


function RouterTest(){
    return (
        <Router>
            <Route path="/">
                <h1>Home</h1>
                <Link href="/math?x=1">math</Link><br/>
                <Link href="/thoughts/0-Morty/suffix">thoughts</Link><br/>
                <Link href="/thoughts/8-Rick/suffix?topic=computer&msg=ayo#tag">search thoughts</Link><br/>
            </Route>
            <Route path="/math">
                <h1>Math</h1>
                <Link href="/math">math</Link><br/>
                <Link href="/thoughts/%#1">thoughts</Link><br/>
            </Route>
            <Route path="/thoughts/{id}-{name}/suffix">
                <Thoughts/>
            </Route>
            <Route path="*">
                <h1>Whoops</h1>
            </Route>
        </Router>
    );
}
```
## useCollapsible hook example
```JS
function CollapsibleTest(){

    const [show, setShow] = useState(false);
    const props = useCollapsible<HTMLDivElement>({show});
    
    return (
        <>
            <div onClick={() => setShow(!show)} style={{backgroundColor:"rgb(240, 245, 240)", padding:"5px", cursor:"pointer"}}>
                <h1>collapsible</h1>
            </div>
            <div {...props}>
                <div 
                    style={{height:"100px",borderBottom:"1px solid gray"}}
                >
                    test
                </div>
            </div>
        </>
    ); 
}
```

## usePopover hook example
```JS
function PopoverTest(){

    const [target, setTarget] = useState<RectElement|null>(null);
    const [element, setElement] = useState<HTMLDivElement|null>(null);
    const [show, setShow] = useState(false);

    const modifiersData = usePopover(element, target, {
        modifiers:[
            {name:"indicator"},
            {name:"computeStyles"},
            {name:"overflow", options:{margin:-16}},
            {name:"offset", options:{main:7, cross:0}}, 
        ],
    });

    const handlePointerOver = () => {
        setShow(true);
    }

    const handlePointerOut = () => {
        setShow(false);
    };

    useEffect(() => {

        const handleContextmenu = (e:MouseEvent) => {
            e.preventDefault();
            console.log(e);
         
            const ve = getVirtualRectElement({x:e.x, y:e.y, width:0, height:0});
            setTarget(ve);
            setShow(true);
        };

        window.addEventListener("contextmenu", handleContextmenu);

        return () => window.removeEventListener("contextmenu", handleContextmenu);
    }, []);


    return (
      <>
        <div 
            style={{border:"1px solid black", width:"300px", height:"300px"}} 
            ref={setTarget} 
            onPointerOver={handlePointerOver} 
            onPointerOut={handlePointerOut}
        >
            target
        </div>
        {show &&
            <div 
                style={{ ...modifiersData.computeStyles}}  
                ref={setElement} 
                className="popover light"
            >
            tooltip or whatever popover
            //make sure indicator element having data-popover-indicator and within popover element when using indicator modifier
            <div style={{...modifiersData.indicator.styles}} {...modifiersData.indicator.attributes} data-popover-indicator></div>
            </div>
        }
      </>
    );
}
```