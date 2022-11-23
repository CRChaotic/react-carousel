# Typescript rewrited react-components
Typescript+React

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
            <CarouselIndicator></CarouselIndicator>
        </Carousel>
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