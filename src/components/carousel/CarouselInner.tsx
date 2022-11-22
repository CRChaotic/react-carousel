import { createContext, useContext, useEffect } from "react";
import { CarouselContext } from "./Carousel";

const CLASS_NAME_ACTIVE = "active";

export interface CarouselInnerProps{
    children?:JSX.Element[];
}

export const CarouselInnerContext = createContext("");

function CarouselInner({children}:CarouselInnerProps){

    const {prev, next, direction, animation, setItemsLength} = useContext(CarouselContext);
    
    const itemsLength = children?.length ?? 0;

    useEffect(() => {
        setItemsLength(itemsLength);
    }, [itemsLength, setItemsLength]);

    const styleItems = (item:JSX.Element, index:number) => {

        if(prev === next){

            if(index === prev){

                return (
                    <CarouselInnerContext.Provider key={index} value={CLASS_NAME_ACTIVE}>
                        {item}
                    </CarouselInnerContext.Provider>
                );
            }else{
                return (
                    <CarouselInnerContext.Provider key={index} value="">
                        {item}
                    </CarouselInnerContext.Provider>
                );
            }

        }else{

            if(index === prev){
                const itemClassName = CLASS_NAME_ACTIVE +" prev " + direction +" " + animation;
                return (
                    <CarouselInnerContext.Provider key={index} value={itemClassName}>
                        {item}
                    </CarouselInnerContext.Provider>
                );
            }else if(index === next){
                const itemClassName = CLASS_NAME_ACTIVE + " next "+ direction +" " + animation;
                return (
                    <CarouselInnerContext.Provider key={index} value={itemClassName}>
                        {item}
                    </CarouselInnerContext.Provider>
                );
            }else{
                return (
                    <CarouselInnerContext.Provider key={index} value="">
                        {item}
                    </CarouselInnerContext.Provider>
                );
            }
        }

    };
    
    return (
        <>
            {children?.map(styleItems)}
        </>
    );
}

export default CarouselInner;