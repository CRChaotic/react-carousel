import { useContext } from "react";
import Link from "../components/router/Link";
import Route from "../components/router/Route";
import Router, { RouterContext } from "../components/router/Router";


function Thoughts(){

    const {currentRoute} = useContext(RouterContext)

    return (
        <>
            <h1>
                Thoughts, id:{currentRoute.vars.id}<br/>
                by {currentRoute.vars.name}<br/>
            </h1>
            <p>
                search:{currentRoute.params.topic}<br/>
                msg:{currentRoute.params.msg}<br/>
                hash:{currentRoute.hash}<br/>
            </p>
            <Link href="/">home</Link><br/>
        </>
    );
}


function Test(){
    return (
        <Router>
            <Route path="/">
                <h1>Home</h1>
                <Link href="/math">math</Link><br/>
                <Link href="/thoughts/0-Morty/suffix">thoughts</Link><br/>
                <Link href="/thoughts/^2-Rick/suffix?topic=computer&msg=ayo#tag">search thoughts</Link><br/>
            </Route>
            <Route path="/math">
                <h1>Math</h1>
                <Link href="/">home</Link><br/>
            </Route>
            <Route path="/thoughts/{id}-{name}/suffix">
                <Thoughts/>
            </Route>
            <Route path="*">
                <h1>Whoops nothing's here</h1>
            </Route>
        </Router>
    );
}

export default Test;