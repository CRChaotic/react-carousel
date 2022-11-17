import { createContext, forwardRef, useContext, useEffect, useRef, useState } from "react";


const regExp = /\/{(\w+)}/g;

const RouterContext = createContext(null);

function Router({children}){

    const pathsRef = useRef(new Map());
    const [currentRoute, setCurrentRoute] = useState({path:"", state:{}});

    const changePath = (href, changeHistory = true) => {

        const urlResovler = new URL(href);
        const resovledPath = urlResovler.pathname;

        if(changeHistory){
            window.history.pushState({href}, "", resovledPath);
        }

        //not found default route 
        let path = "*";
        let state = {};

        //check out existing path first, try out regExp version if paths does not have it  
        if(pathsRef.current.has(resovledPath)){

            path = resovledPath;

        }else {
            for(let [relativePath, pathRegExp] of pathsRef.current.entries()){

                const matched = resovledPath.match(pathRegExp);
                if(matched != null){
                    path = relativePath;
                    state = matched.groups;
                }

            }
        }

        setCurrentRoute({path, state});
        console.log("currentPath:", path, state);
    };

    const addPath = (path) => {
        //transform path to regular expression
        const pathRegExp = path.replaceAll(regExp, (match, name) => {
            return `/(?<${name}>\\w+)`;
        });

        pathsRef.current.set(path, new RegExp(`^${pathRegExp === "*" ? "\\*":pathRegExp}$`));
    };

    const removePath = (path) => {
        pathsRef.current.delete(path);
    }

    useEffect(() => {
        
        //loading first route based on location
        changePath(window.location.href);

        //moving back and forth
        const handlePopState = (e) => {
            // console.log("changed location:", e.state);
            const href = e.state.href;
            changePath(href, false);
        };

        window.addEventListener("popstate", handlePopState);

        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    return (
        <RouterContext.Provider value={{currentRoute, addPath, changePath, removePath}}>
            {children}
        </RouterContext.Provider>
    );
}


function Route({path, children}){

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

const Link = forwardRef(({children, ...props}, ref) => {

    const {changePath} = useContext(RouterContext);

    const handleClick = (e) => {
        e.preventDefault();

        changePath(e.target.href);

        if(typeof props.onClick === "function"){
            props.onClick(e);
        }
    };

    return (
        <a {...props} ref={ref} onClick={handleClick}>
            {children}
        </a>
    );
});

export default Router;
export { Route, Link };


function TestPage(){
    const {currentRoute} = useContext(RouterContext);

    return (
        <div>
            Hi {currentRoute.state.name}, here is thoughts page, your id:{currentRoute.state.id}
        </div>
    );
}

function TestPageProvider(){

    return (
        <Router>
            <Route path="/">
                <div>
                    home page<br/>
                    <Link href="/math">math</Link><br/>
                    <Link href="/thoughts/0/Ryan/suffix">thoughts</Link><br/>
                    <Link href="/computer">computer</Link><br/>
                    <Link href="/nowhere">error</Link><br/>
                </div>
            </Route>
            <Route path="/math">
                <div>
                    math page<br/>
                    <Link href="/thoughts/1/rick/suffix">thoughts</Link><br/>
                    <Link href="/computer">computer</Link><br/>
                </div>
            </Route>
            <Route path="/thoughts/{id}/{name}/suffix">
                <TestPage></TestPage>
            </Route>
            <Route path="/thoughts/1/rick/suffix">
                <h1>I'm Pickle Rick</h1>
            </Route>
            <Route path="/computer">
                <div>computer page</div>
            </Route>
            <Route path="*">
                <h1>404 not found</h1>
            </Route>
        </Router>
    );
}

export { TestPageProvider };