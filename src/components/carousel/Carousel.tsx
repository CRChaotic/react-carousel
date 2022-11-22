import React, { createContext, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import "./styles/Carousel.css";
import "./styles/CarouselItem.css";

const CLASS_NAME_CAROUSEL = "carousel";
const CLASS_NAME_ITEM = "carousel-item";
const CLASS_NAME_ACTIVE = "active";
const CLASS_NAME_FORWARD = "forward";
const CLASS_NAME_BACKWARD = "backward";
const CLASS_NAME_PREV = "prev";
const CLASS_NAME_NEXT = "next";
const SLIDE_THRESHOLD = 0.3;

type Animation = "slide"|"fade";
type Direction = "forward"|"backward";

export interface CarouselProps extends React.ComponentPropsWithRef<"div">{
    items:React.ReactNode[];
    animation?:Animation; 
    isEnabledAutoplay?:boolean; 
    interval?:number;  
    autoplayOffset?:number; 
    onSwitchStart?:(next:number, direction:Direction) => void; 
    onSwitchEnd?:(prev:number, direction:Direction) => void;
}

interface CarouselContextInterface{
    prev:number;
    next:number;
    itemsLength:number;
    switchByOffset:(offset:number) => void;
    switchByIndex:(index:number) => void;
}

export const CarouselContext = createContext<CarouselContextInterface>(null!);


const Carousel = forwardRef<HTMLDivElement, CarouselProps>(({
        items, 
        animation = "", 
        isEnabledAutoplay = true, 
        interval = 3500, 
        autoplayOffset = 1,
        children,
        onSwitchStart,
        onSwitchEnd,
        onTouchEnd,
        onTouchStart,
        ...props
    }, ref) => {

    const [prev, setPrev] = useState(0);
    const [next, setNext] = useState(0);
    const [direction, setDirection] = useState<Direction>(CLASS_NAME_FORWARD);
    const [isPaused, setIsPaused] = useState(false);
    const touchRef = useRef<any>(null);

    const isSwitching = prev !== next && animation !== "";
    const itemsLength = items.length;
    
    const switchNext = useCallback((next:number, direction:Direction) => {
        setNext(next);
        setDirection(direction);

        if(animation !== ""){
            return;
        }
        setPrev(next);

    }, [animation]);

    useEffect(() => {
        if(typeof onSwitchStart !== "function"){
            return;
        }
        onSwitchStart(next, direction);
    }, [next, direction, onSwitchStart]);

    useEffect(() => {
        if(typeof onSwitchEnd !== "function"){
            return;
        }
        onSwitchEnd(prev, direction);
    }, [prev, direction ,onSwitchEnd]);

    useEffect(() => {

        if(next !== prev || itemsLength === 0 || !isEnabledAutoplay || isPaused || autoplayOffset === 0 || interval < 0){
            return
        }

        const timer = setTimeout(() => {
            let next = (prev + itemsLength + autoplayOffset%itemsLength)%itemsLength;
            let direction:Direction = autoplayOffset < 0 ? CLASS_NAME_BACKWARD : CLASS_NAME_FORWARD;
            switchNext(next, direction);

        }, interval);

        return () => clearTimeout(timer);

    }, [prev, next, itemsLength, isEnabledAutoplay, interval, isPaused, autoplayOffset, switchNext]);


    const switchByOffset = (offset:number) => {
        if(isSwitching || !isFinite(offset)){
            return;
        }
        
        let next = (prev + itemsLength + offset%itemsLength)%itemsLength;
        let direction:Direction = offset < 0 ? CLASS_NAME_BACKWARD : CLASS_NAME_FORWARD;
        switchNext(next, direction);
    };

    const switchByIndex = (index:number) => {
        if(isSwitching || !isFinite(index) || index > itemsLength || index < 0){
            return;
        }

        let next = Number(index);
        let direction:Direction = index < prev ? CLASS_NAME_BACKWARD : CLASS_NAME_FORWARD;
        switchNext(next, direction);
    };

    const handlePointerEnter = (e:React.PointerEvent<HTMLDivElement>) => {
        if(isEnabledAutoplay){
            setIsPaused(true);
        }

        if(props.onPointerEnter){
            props.onPointerEnter(e);
        }
    };

    const handlePointerLeave = (e:React.PointerEvent<HTMLDivElement>) => {
        if(isEnabledAutoplay){
            setIsPaused(false);
        }

        if(props.onPointerLeave){
            props.onPointerLeave(e);
        }
    };

    const handleTouchStart = (e:React.TouchEvent<HTMLDivElement>) => {
        if(touchRef.current != null){
            return;
        }

        touchRef.current = e.targetTouches[0];
        touchRef.current.timeStamp = e.timeStamp;
    };

    const handleTouchEnd = (e:React.TouchEvent<HTMLDivElement>) => {
        const touch = touchRef.current;

        if(e.changedTouches[0].identifier !== touch.identifier){
            return;
        }

        let s = touch.pageX - e.changedTouches[0].pageX;
        let t = e.timeStamp - touch.timeStamp;

        if(s/t > SLIDE_THRESHOLD){
            switchByOffset(1);
        }else if(s/t < -SLIDE_THRESHOLD){
            switchByOffset(-1);
        }

        touchRef.current = null;
    };

    
    const styleItems = (item:React.ReactNode, index:number) => {

        let classNameList = [CLASS_NAME_ITEM];
        
        if(isSwitching){
            if(index === next){
                classNameList= classNameList.concat([CLASS_NAME_ACTIVE, direction, CLASS_NAME_NEXT, animation]);
            }else if(index === prev){
                classNameList = classNameList.concat([CLASS_NAME_ACTIVE, direction, CLASS_NAME_PREV, animation]);
            }
        }else{
            if(index === prev){
                classNameList =  classNameList.concat([CLASS_NAME_ACTIVE]);
            }
        }

        return (
            <div 
                key={index} 
                className={classNameList.join(" ")} 
                onAnimationEnd={(e) => e.target === e.currentTarget && setPrev(next)}
            >
                {item}
            </div>
        );
    };

    return (
        <div {...props}
            ref={ref} 
            className={CLASS_NAME_CAROUSEL} 
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <CarouselContext.Provider value={{prev, next, itemsLength, switchByIndex, switchByOffset}}>
                {items.map(styleItems)}
                {children}
            </CarouselContext.Provider>
        </div>
    );
});


Carousel.displayName = "Carousel";

export default Carousel;