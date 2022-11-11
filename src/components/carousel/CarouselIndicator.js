import { forwardRef, useContext } from "react";
import { CarouselContext } from "./Carousel";

import "./CarouselIndicator.css";

const CLASS_NAME_INDICATOR_CONTAINER = "carousel-indicator-container";
const CLASS_NAME_INDICATOR = "carousel-indicator";
const CLASS_NAME_ACTIVE = "active";

const CarouselIndicator = forwardRef((props, ref) =>{

    const {next, length, setNextByIndex} = useContext(CarouselContext);
    const indicators = [];

    for(let i = 0; i < length; i++){
        let indicator = null;

        if(i === next){
            indicator = <div key={i} className={[CLASS_NAME_INDICATOR, CLASS_NAME_ACTIVE].join(" ")}></div>;
        }else{
            indicator = <div key={i} className={CLASS_NAME_INDICATOR} onClick={() =>setNextByIndex(i)}></div>;
        }

        indicators.push(indicator);
    }

    return (
        <div 
            {...props}
            ref={ref} 
            className={[CLASS_NAME_INDICATOR_CONTAINER, props.className].join(" ")}
        >
            {indicators}
        </div>
    );
});

export default CarouselIndicator;