import { useState } from "react";
import useCollapsible from "../hooks/useCollapsible";

function UseCollapsibleTest(){

    const [show, setShow] = useState(false);
    const props = useCollapsible<HTMLDivElement>({show});

    return (
    <>
        <div onClick={() => setShow(!show)} style={{backgroundColor:"rgb(240, 245, 240)", padding:"5px", cursor:"pointer"}}>
            <h1>collapsible</h1>
        </div>
        {
            <div {...props} >
                <div 
                    style={{height:"100px",borderBottom:"1px solid gray"}}
                >
                    test
                </div>
            </div>
        }
    </>
    );
}

export { UseCollapsibleTest };