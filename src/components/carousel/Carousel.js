import { createContext, forwardRef, useCallback, useEffect, useRef, useState } from "react";

import "./styles/Carousel.css";

const CLASS_NAME_CAROUSEL = "carousel";
const CLASS_NAME_ITEM = "carousel-item";
const CLASS_NAME_ACTIVE = "active";
const CLASS_NAME_FORWARD = "forward";
const CLASS_NAME_BACKWARD = "backward";
const CLASS_NAME_PREVIOUS = "previous";
const CLASS_NAME_NEXT = "next";

const SLIDE_THRESHOLD = 0.3;
const AUTOPLAY_THRESHOLD = 1;

const CarouselContext = createContext({current:0, next:0, length:0});

const Carousel = forwardRef((
    {
        items = [], 
        animation = "", 
        isEnabledAutoplay = true, 
        interval = 3500, 
        autoplayOffset = 1,
        children,
        onSwitchStart,
        onSwitchEnd,
        ...props
    }, 
    ref
    ) => {

    const [previous, setPrevious] = useState(0);
    const [next, setNext] = useState(0);
    const [direction, setDirection] = useState(CLASS_NAME_FORWARD);
    const [isPaused, setIsPaused] = useState(true);
    const carouselRef = useRef(null);
    const touchRef = useRef(null);

    const isSwitching = previous !== next && animation !== "";
    const length = items.length;
    
    const switchNext = useCallback((next, direction) => {
        setNext(next);
        setDirection(direction);

        if(animation !== ""){
            return;
        }
        setPrevious(next);

    }, [animation]);

    useEffect(() => {
        if(typeof onSwitchStart !== "function"){
            return;
        }
        onSwitchStart(next);
    }, [next, onSwitchStart]);

    useEffect(() => {
        if(typeof onSwitchEnd !== "function"){
            return;
        }
        onSwitchEnd(previous);
    }, [previous, onSwitchEnd]);

    useEffect(() => {

        if(!(next === previous && length > 0 && isEnabledAutoplay && !isPaused && autoplayOffset !== 0 && interval >= 0)){
            return
        }

        const timer = setTimeout(() => {
            let next = (previous + length + autoplayOffset%length)%length;
            let direction = autoplayOffset < 0 ? CLASS_NAME_BACKWARD : CLASS_NAME_FORWARD;
            switchNext(next, direction);

        }, interval);

        return () => clearTimeout(timer);

    }, [previous, next, length, isEnabledAutoplay, interval, isPaused, autoplayOffset, switchNext]);


    useEffect(() => {
        if(!isEnabledAutoplay){
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting){
                setIsPaused(false);
            }else{
                setIsPaused(true);
            }
        }, {threshold:AUTOPLAY_THRESHOLD});

        observer.observe(carouselRef.current);

        return () => observer.disconnect();
    }, [isEnabledAutoplay]);


    const setNextByOffset = (offset) => {
        if(isSwitching || !isFinite(offset)){
            return;
        }
        
        let next = (previous + length + offset%length)%length;
        let direction = offset < 0 ? CLASS_NAME_BACKWARD : CLASS_NAME_FORWARD;
        switchNext(next, direction);
    };

    const setNextByIndex = (index) => {
        if(isSwitching || !isFinite(index) || index > length || index < 0){
            return;
        }

        let next = Number(index);
        let direction = index < previous ? CLASS_NAME_BACKWARD : CLASS_NAME_FORWARD;
        switchNext(next, direction);
    };

    const handlePointerOver = () => {
        if(!isEnabledAutoplay){
            return;
        }
        setIsPaused(true);
    };

    const handlePointerOut = () => {
        if(!isEnabledAutoplay){
            return;
        }
        setIsPaused(false);
    };

    const handleTouchStart = (e) => {
        if(touchRef.current != null){
            return;
        }

        touchRef.current = e.targetTouches[0];
        touchRef.current.timeStamp = e.timeStamp;
    };

    const handleTouchEnd = (e) => {
        const touch = touchRef.current;

        if(e.changedTouches[0].identifier !== touch.identifier){
            return;
        }

        let s = touch.pageX - e.changedTouches[0].pageX;
        let t = e.timeStamp - touch.timeStamp;

        if(s/t > SLIDE_THRESHOLD){
            setNextByOffset(1);
        }else if(s/t < -SLIDE_THRESHOLD){
            setNextByOffset(-1);
        }

        touchRef.current = null;
    };

    
    const styleItems = (item, index) => {

        let classNameList = [CLASS_NAME_ITEM];
        
        if(isSwitching){
            if(index === next){
                classNameList= classNameList.concat([CLASS_NAME_ACTIVE, direction, CLASS_NAME_NEXT, animation]);
            }else if(index === previous){
                classNameList = classNameList.concat([CLASS_NAME_ACTIVE, direction, CLASS_NAME_PREVIOUS, animation]);
            }
        }else{
            if(index === previous){
                classNameList =  classNameList.concat([CLASS_NAME_ACTIVE]);
            }
        }

        return (
            <div 
                key={index} 
                className={classNameList.join(" ")} 
                onAnimationEnd={(e) => e.target === e.currentTarget && setPrevious(next)}
            >
                {item}
            </div>
        );
    };

    return (
        <div {...props}
            ref={(node) => {carouselRef.current = node; if(ref) ref.current = node;}} 
            className={CLASS_NAME_CAROUSEL} 
            onPointerOver={(e) => {
                handlePointerOver(e);
                if(typeof props.onPointerOver !== "function"){
                   return; 
                }
                props.onPointerOver(e);
            }}
            onPointerOut={(e) => {
                handlePointerOut(e);
                if(typeof props.onPointerOut !== "function"){
                    return;
                }
                props.onPointerOut(e);
            }}
            onTouchStart={(e) => {
                handleTouchStart(e);
                if(typeof props.onTouchStart !== "function"){
                    return;
                }
                props.onTouchStart(e);
            }}
            onTouchEnd={(e) => {
                handleTouchEnd(e);
                if(typeof props.onTouchEnd !== "function"){
                    return;
                }
                props.onTouchEnd(e);
            }}
        >
            <CarouselContext.Provider value={{previous, next, length, setNextByIndex, setNextByOffset}}>
                {items.map(styleItems)}
                {children}
            </CarouselContext.Provider>
        </div>
    );
});

export default Carousel;
export { CarouselContext };