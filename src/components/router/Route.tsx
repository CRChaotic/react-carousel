import React, { useContext, useEffect } from "react";
import { RouterContext } from "./Router";


export interface RouteProps{
    path:string;
    children?:React.ReactNode;
}

function Route({path, children}:RouteProps){

    const {currentRoute, addPath, removePath} = useContext(RouterContext);

    useEffect(() => {
        addPath(path);
        return () => removePath(path);
    }, [path, addPath, removePath]);

    return (
        <>
            {currentRoute.path === path &&
                children
            }
        </>
    );
}

export default Route;