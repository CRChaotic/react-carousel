import React, { forwardRef, useContext } from "react";
import { RouterContext } from "./Router";

export interface LinkProps{
    href:string;
    onClick?:(event: React.PointerEvent<HTMLAnchorElement>) => void;
    children?:React.ReactNode;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({children, onClick, ...props}, ref) => {

    const {changePath} = useContext(RouterContext);

    const handleClick = (e:React.PointerEvent<HTMLAnchorElement>):void => {
        e.preventDefault();
        const href = e.currentTarget.href;
        if(href !== ""){
            changePath(href);
        }

        if(typeof onClick === "function"){
            onClick(e);
        }
    };

    return (
        <a {...props} ref={ref} onClick={handleClick}>
            {children}
        </a>
    );
});

Link.displayName = "Link";

export default Link;