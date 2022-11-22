import { createContext, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import "./styles/Carousel.css";

const CLASS_NAME_CAROUSEL = "carousel";
const SLIDE_THRESHOLD = 0.3;

type Animation = "slide"|"fade";
type Direction = "forward"|"backward";

export interface CarouselProps extends React.ComponentPropsWithoutRef<"div">{
    animation?:Animation; 
    isEnabledAutoplay?:boolean; 
    interval?:number;  
    autoplayOffset?:number; 
    onSwitchStart?:(prev:number, next:number, direction:Direction) => void; 
    onSwitchEnd?:(prev:number, next:number, direction:Direction) => void;
}

interface CarouselContextInterface{
    prev:number;
    next:number;
    direction:Direction;
    itemsLength:number;
    animation?:Animation;
    setItemsLength: React.Dispatch<React.SetStateAction<number>>;
    finishSwitching:(next:number) => void;
    switchByOffset:(offset:number) => void;
    switchByIndex:(index:number) => void;
}

export const CarouselContext = createContext<CarouselContextInterface>(null!);


const Carousel = forwardRef<HTMLDivElement, CarouselProps>(({
    className, 
    animation, 
    isEnabledAutoplay = true, 
    interval = 4500, 
    autoplayOffset = 1,
    children,
    onSwitchStart,
    onSwitchEnd,
    ...props
}:CarouselProps, ref) => {

    const [prev, setPrev] = useState(0);
    const [next, setNext] = useState(0);
    const [direction, setDirection] = useState<Direction>("forward");
    const [itemsLength, setItemsLength] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchRef = useRef<any>(null);
    
    const switchNext = useCallback((next:number, direction:Direction) => {
        setNext(next);
        setDirection(direction);

        if(!animation){
            setPrev(next);
        }
    }, [animation]);


    useEffect(() => {
        if(prev === next && onSwitchEnd){
            onSwitchEnd(prev, next, direction);
        }else if(prev !== next && onSwitchStart){
            onSwitchStart(prev, next, direction);
        }
    }, [prev, next, direction, onSwitchEnd, onSwitchStart]);


    useEffect(() => {

        if(prev !== next || !isEnabledAutoplay || itemsLength === 0 || isPaused){
            return;
        }

        const handleAutoplay = () => {
            const nextIndex = (prev + autoplayOffset%itemsLength)%itemsLength;
            const direction = autoplayOffset > 0 ? "forward":"backward";

            switchNext(nextIndex, direction);
        };

        const autoplayTimer = setTimeout(handleAutoplay, interval);

        console.log("sechduled next run");

        return () => clearTimeout(autoplayTimer);

    }, [prev, next, isEnabledAutoplay, isPaused, interval, autoplayOffset, itemsLength, switchNext]);


    const switchByOffset = (offset:number) => {
        if(prev !== next || !isFinite(offset)){
            return;
        }
        
        const nextIndex = (prev + itemsLength + offset%itemsLength)%itemsLength;
        const direction = offset > 0 ? "forward":"backward";
        
        switchNext(nextIndex, direction);
    };

    const switchByIndex = (index:number) => {
        if(
            prev !== next || 
            index < 0 || 
            index > itemsLength-1 ||
            index === prev ||
            !isFinite(index)
        ){
            return;
        }

        const direction = index > prev ? "forward":"backward";

        switchNext(index, direction);
    };

    const handlePointerEnter = () => {
        if(!isEnabledAutoplay){
            return;
        }
        setIsPaused(true);
    };

    const handlePointerLeave = () => {
        if(!isEnabledAutoplay){
            return;
        }
        setIsPaused(false);
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

    return (
        <CarouselContext.Provider 
            value={{prev, next, direction, itemsLength, animation, finishSwitching:setPrev,  setItemsLength, switchByOffset, switchByIndex}}
        >
            <div 
                {...props}
                ref={ref} 
                className={CLASS_NAME_CAROUSEL + (className ? " " + className:"")}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {children}
            </div>
        </CarouselContext.Provider>
    );
});

Carousel.displayName = "Carousel";

export default Carousel;