import React, { forwardRef, useContext } from "react";
import { CarouselContext } from "./Carousel";
import { CarouselInnerContext } from "./CarouselInner";
import "./styles/CarouselItem.css";

const CLASS_NAME_ITEM = "carousel-item";

export interface CarouselItemProps extends  React.ComponentPropsWithoutRef<"div">{
    animationClassName?:string;
}

const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(({
    children, 
    className, 
    ...props
}, ref) => {

    const {next, finishSwitching} = useContext(CarouselContext);
    const itemClassName = useContext(CarouselInnerContext);

    let classNames = CLASS_NAME_ITEM;

    if(className){
        classNames += " " +className;
    }

    if(itemClassName){
        classNames += " " + itemClassName;
    }

    const handleAniamtionEnd = (e:React.AnimationEvent<HTMLDivElement>) => {

        if(e.currentTarget !== e.target){
            return;
        }

        finishSwitching(next);
    };

    return (
        <div {...props} ref={ref} className={classNames} onAnimationEnd={handleAniamtionEnd}>
            {children}
        </div>
    );
   
});

CarouselItem.displayName = "CarouselItem";

export default CarouselItem;