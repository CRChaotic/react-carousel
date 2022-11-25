import { useContext } from "react";
import Link from "../components/router/Link";
import Route from "../components/router/Route";
import Router, { RouterContext } from "../components/router/Router";


function Thoughts(){

    const {currentRoute} = useContext(RouterContext)

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


function Test(){
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

export default Test;