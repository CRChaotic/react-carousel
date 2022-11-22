import React, { forwardRef, useContext } from "react";
import { RouterContext } from "./Router";

export interface LinkProps extends React.ComponentPropsWithRef<"a">{
    href:string;
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