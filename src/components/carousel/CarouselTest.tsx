import { useCallback } from "react";
import Carousel from "./Carousel";
import CarouselButton from "./CarouselButton";
import CarouselIndicator from "./CarouselIndicator";
import CarouselInner from "./CarouselInner";
import CarouselItem from "./CarouselItem";

const items = [
    <div style={{width:"100%", height:"100%", backgroundColor:"purple"}}>item1</div>,
    <div style={{width:"100%", height:"100%", backgroundColor:"yellowgreen"}}>item2</div>,
    <div style={{width:"100%", height:"100%", backgroundColor:"blue"}}>item3</div>,
];

function CarouselTest(){

    const hanldeSwitchStart = useCallback((prev:number, next:number) => {
        console.log("start prev:", prev, "next:", next);
    }, []);

    const hanldeSwitchEnd = useCallback((prev:number, next:number) => {
        console.log("end");
    }, []);

    return (
        <Carousel 
            style={{width:"80%", height:"500px"}} 
            animation="slide"
            interval={3500} 
            onSwitchStart={hanldeSwitchStart}
            onSwitchEnd={hanldeSwitchEnd}
        >
            <CarouselInner>
                {items.map((item, index) => <CarouselItem key={index} >{item}</CarouselItem>)}
            </CarouselInner>

            <CarouselButton placement="left"></CarouselButton>
            <CarouselButton placement="right"></CarouselButton>
            <CarouselIndicator></CarouselIndicator>
        </Carousel>
    );
}

export default CarouselTest;