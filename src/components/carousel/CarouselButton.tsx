import { forwardRef, useContext } from "react";
import { CarouselContext } from "./Carousel";
import "./styles/CarouselButton.css";

const CLASS_NAME_BUTTON = "carousel-btn";

export interface CarouselButtonProps extends React.ComponentPropsWithoutRef<"button">{
    placement:"left"|"right";
}

const CarouselButton = forwardRef<HTMLButtonElement, CarouselButtonProps>((props, ref) => {

    const {switchByOffset} = useContext(CarouselContext);

    const {placement} = props;
    let classNames = CLASS_NAME_BUTTON +" "+ placement;

    if(props.className){
        classNames += " " +props.className;
    }

    const handleClick = () => {
        if(placement === "left"){
            switchByOffset(-1);
        }else{
            switchByOffset(1);
        }
    };

    return (
        <button ref={ref} type="button" className={classNames} onClick={handleClick}>{props.children}</button>
    );
})

CarouselButton.displayName = "CarouselButton";

export default CarouselButton;