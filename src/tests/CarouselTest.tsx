import { useCallback } from "react";
import Carousel from "../components/carousel/Carousel";
import CarouselButton from "../components/carousel/CarouselButton";
import CarouselIndicator from "../components/carousel/CarouselIndicator";


const items = [
    <div key={0} style={{width:"100%", height:"100%", backgroundColor:"purple"}}>item1</div>,
    <div key={1} style={{width:"100%", height:"100%", backgroundColor:"yellowgreen"}}>item2</div>,
    <div key={2} style={{width:"100%", height:"100%", backgroundColor:"blue"}}>item3</div>,
];

function CarouselTest(){

    const hanldeSwitchStart = useCallback((next:number, direction:string) => {
        console.log("start next:", next, direction);
    }, []);

    const hanldeSwitchEnd = useCallback((prev:number) => {
        console.log("end");
    }, []);

    return (
        <Carousel
            items={items} 
            style={{width:"80%", height:"500px"}} 
            animation="slide"
            interval={3500} 
            onSwitchStart={hanldeSwitchStart}
            onSwitchEnd={hanldeSwitchEnd}
        >
            <CarouselButton placement="left"></CarouselButton>
            <CarouselButton placement="right"></CarouselButton>
            <CarouselIndicator/>
        </Carousel>
    );
}

export default CarouselTest;