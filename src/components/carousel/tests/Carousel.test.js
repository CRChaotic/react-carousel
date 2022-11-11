import { fireEvent, render, screen } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import { setupMockIntersectionObserver } from "../../../tests/utils";


import Carousel from "../Carousel";
import CarouselButton from "../CarouselButton";

let mockIntersectionObserver = null;
beforeEach(() => {
    mockIntersectionObserver = setupMockIntersectionObserver();
});

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

function getActiveItem(content, element){
    if(element.classList.contains("carousel-item") && element.classList.contains("active")){
        return true;
    } 
    return false;
}

function finishSwitching(){
    act(() => {
        setTimeout.mock.lastCall[0]();
    });
    screen.getAllByText(getActiveItem)
    .forEach((activeItem) => {
        fireEvent.animationEnd(activeItem);
    });
}

function getTestItems(){
    return [
        <div>item1</div>,
        <div>item2</div>,
        <div>item3</div>
    ];
}

test("autoplay having animation without interactions", () => {
    render(
        <Carousel animation="slide" items={getTestItems()} isEnabledAutoplay={true}>
            <CarouselButton placement="left">left</CarouselButton>
            <CarouselButton placement="right">right</CarouselButton>
        </Carousel>
    );

    expect(screen.getByText(getActiveItem)).toHaveTextContent("item1");
    
    //carousel is visible
    act(() => {
        mockIntersectionObserver.mock.lastCall[0]([{isIntersecting:true}]);
    });
    expect(setTimeout).toHaveBeenCalledTimes(1);

    finishSwitching();
    expect(screen.getAllByText(getActiveItem).length).toBe(1);
    expect(screen.getByText(getActiveItem)).toHaveTextContent("item2");
    expect(setTimeout).toHaveBeenCalledTimes(2);

    finishSwitching();
    expect(screen.getAllByText(getActiveItem).length).toBe(1);
    expect(screen.getByText(getActiveItem)).toHaveTextContent("item3");
    expect(setTimeout).toHaveBeenCalledTimes(3);
});


test("should not autoplay when having no intersection with viewport", () => {

    render(
        <Carousel animation="slide" items={getTestItems()} isEnabledAutoplay={true}>
            <CarouselButton placement="left">left</CarouselButton>
            <CarouselButton placement="right">right</CarouselButton>
        </Carousel>
    );

    expect(screen.getByText(getActiveItem)).toHaveTextContent("item1");
    expect(setTimeout).toHaveBeenCalledTimes(0);

});


test("should switch when clicked right or left button", () => {

    render(
        <Carousel items={getTestItems()} isEnabledAutoplay={false}>
            <CarouselButton placement="left">left</CarouselButton>
            <CarouselButton placement="right">right</CarouselButton>
        </Carousel>
    );

    expect(screen.getByText(getActiveItem)).toHaveTextContent("item1");

    fireEvent.click(screen.getByRole("button", {name:"left"}));
    expect(screen.getByText(getActiveItem)).toHaveTextContent("item3");

    fireEvent.click(screen.getByRole("button", {name:"right"}));
    expect(screen.getByText(getActiveItem)).toHaveTextContent("item1");
});