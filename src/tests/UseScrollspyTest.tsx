import React, { useRef } from "react";
import useScrollspy from "../hooks/useScrollspy";

function createLists<T extends {[k:string]:any}>(
    lists:T[], 
    createListItem:(item:T, children:React.ReactNode[]|null) => React.ReactNode, 
    childrenAlias = "children"
):React.ReactNode[]{
    return lists.map((item:T) => {

        let childItems = null;
        if(item[childrenAlias]){   
            childItems = createLists(item[childrenAlias], createListItem, childrenAlias);
        }

        return createListItem(item, childItems);
    });
}


function UseScrollspyTest(){

    const idsRef = useRef(["a", "b", "c", "a1", "a2"])
    const activeIdsSet = useScrollspy(idsRef.current);

    const testStruct = [
        {id:"a", value:"a", children:[{id:"a1", value:"a1"},  {id:"a2", value:"a2"}]},
        {id:"b", value:"b"}, 
        {id:"c", value:"c"}
    ];

    const lists = createLists(testStruct, (item, children) => {
        return (
            <li key={item.id} >
                <a style={{color:activeIdsSet.has(item.id) ? "orange":"black"}} href={`#${item.id}`}>
                    {item.value}
                </a>
                <ul>
                    {children}
                </ul>
            </li>
        );
    });

    return (
        <>
            <ul style={{position:"fixed", marginLeft:"100px"}}>
                {lists}
            </ul>

            <div id="a" style={{border:"1px solid gray"}}>
                <h1>1</h1>
           
                <div id="a1" style={{minWidth:"500px", height:"500px", border:"1px solid gray"}}>
                    a1
                </div>
                <div id="a2" style={{minWidth:"500px", height:"500px", border:"1px solid gray"}}>
                    a2
                </div>
            </div>
           
            <div id="b" style={{minWidth:"500px", height:"1500px",  border:"1px solid gray"}}>
                <h1>2</h1>
            </div>
            <div id="c" style={{minWidth:"500px", height:"500px",  border:"1px solid gray"}}>
                <h1>3</h1>
            </div>
        </>
    );
}

export {UseScrollspyTest};