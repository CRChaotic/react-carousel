import React, { createContext, useEffect, useRef, useState } from "react";

const PathVariableRegExp = /{(\w+)}/g;


interface CurrentRoute{
    path:string;
    var:{
        [k:string]:string
    };
    param:{
        [k:string]:string
    };
    hash:string;
}

interface RouterContextInterface{
    currentRoute:CurrentRoute;
    addPath:(path:string) => void;
    removePath:(path:string) => void;
    changePath:(path:string) => void;
}

export const RouterContext = createContext<RouterContextInterface>(null!);

export interface RouterProps{
    children?:React.ReactNode;
}

function Router({children}:RouterProps){

    const pathsRef = useRef(new Map<string, RegExp>());
    const [currentRoute, setCurrentRoute] = useState<CurrentRoute>({path:"", var:{}, param:{}, hash:""});
    
    const changePath = (rawPath:string, changeHistory = true) => {

        const url = new URL(rawPath);
        const path = url.pathname;
        const currentParams = Object.fromEntries(url.searchParams.entries());
        const currentHash = url.hash;

        if(changeHistory){
            window.history.pushState({path:rawPath}, "", rawPath);
        }

        let currentPath = "*";
        let currentVariables = {};

        try{
            const decodedPath = decodeURI(path);
            if(pathsRef.current.has(path)){
    
                currentPath = path;
    
            }else {
                for(let [relativePath, pathRegExp] of pathsRef.current.entries()){

                    const matched = decodedPath.match(pathRegExp);
    
                    if(matched && matched.groups){
                        currentPath = relativePath;
                        currentVariables = matched.groups;
                        break;
                    }

                }
            }
        }catch{
           console.warn("URL is invaild:"+rawPath);
        }

        console.log("current:", {path:currentPath, var:currentVariables, param:currentParams, hash:currentHash});

        setCurrentRoute({path:currentPath, var:currentVariables, param:currentParams, hash:currentHash});
    };


    useEffect(() => {
        const initRawPath = window.location.href;
        console.log(initRawPath);
        changePath(initRawPath);

        const handlePopState = (e:PopStateEvent) => {
            changePath(e.state.path, false);
        };

        window.addEventListener("popstate", handlePopState);

        return () => window.removeEventListener("popstate", handlePopState);

    },[]);


    const addPath = (rawPath:string) => {
        //transform path to regular expression
        const pathRegExp = rawPath.replace(PathVariableRegExp, (match, name) => {
            return `(?<${name}>[^/]+)`;
        });

        pathsRef.current.set(rawPath, new RegExp(`^${pathRegExp === "*" ? "\\*":pathRegExp}$`));
    };
    

    const removePath = (rawPath:string) => {
        pathsRef.current.delete(rawPath);
    };

    
    return (
        <RouterContext.Provider value={{currentRoute, addPath, removePath, changePath}}>
            {children}
        </RouterContext.Provider>
    );
}

export default Router;