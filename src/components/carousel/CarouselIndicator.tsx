import { forwardRef, useContext } from "react";
import { CarouselContext } from "./Carousel";
import "./styles/CarouselIndicator.css";

const CLASS_NAME_INDICATOR_CONTAINER = "carousel-indicator-container";
const CLASS_NAME_INDICATOR = "carousel-indicator";
const CLASS_NAME_ACTIVE = "active";


const CarouselIndicator = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(({ 
    children, 
    className, 
    ...props
}, ref) => {

    const {next, itemsLength, switchByIndex} = useContext(CarouselContext);
    const indicators = [];

    for(let i = 0; i < itemsLength; i++){
        let indicator = null;

        if(i === next){
            indicator = <div key={i} className={[CLASS_NAME_INDICATOR, CLASS_NAME_ACTIVE].join(" ")}></div>;
        }else{
            indicator = <div key={i} className={CLASS_NAME_INDICATOR} onClick={() =>switchByIndex(i)}></div>;
        }

        indicators.push(indicator);
    }

    let classNames = className ? CLASS_NAME_INDICATOR_CONTAINER + " " + className : CLASS_NAME_INDICATOR_CONTAINER;

    return (
        <div 
            {...props}
            ref={ref} 
            className={classNames}
        >
            {indicators}
        </div>
    );
});

CarouselIndicator.displayName = "CarouselIndicator";

export default CarouselIndicator;