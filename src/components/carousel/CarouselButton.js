import { forwardRef, useContext } from "react";
import { CarouselContext } from "./Carousel";

import "./styles/CarouselButton.css";

const CLASS_NAME_BTN = "carousel-btn";

const CarouselButton = forwardRef((props, ref) => {

    const { placement } = props;
    const { setNextByOffset } = useContext(CarouselContext);

    const handleClick = () => {
        if(placement === "left" || placement === "top"){
            setNextByOffset(-1)
        }else if(placement === "right" || placement === "down"){
            setNextByOffset(1);
        }

        if(typeof props.onClick === "function"){
            props.onClick();
        }
    }


    return (
        <button
            {...props}
            placement={null}  
            ref={ref} 
            type="button" 
            className={[CLASS_NAME_BTN, placement, props.className].join(" ")} 
            onClick={handleClick}
        >
            {props.children}
        </button>
    );
});


export default CarouselButton;
