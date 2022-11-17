# Some basic components just for fun
based on React

## Carousel example
```javascript
const items = [
  <div style={{backgroundColor:"purple", width:"100%", height:"100%"}}>item1</div>,
  <div style={{backgroundColor:"blue", width:"100%", height:"100%"}}>item2</div>,
  <div style={{backgroundColor:"pink", width:"100%", height:"100%"}}>item3</div>,
];
//Make sure carousel having size(e.g width:800px, height:500px)
//Animation could be one of slide, fade or just empty string or does not provide prop animation which means no animation 
<Carousel 
  items={items} 
  interval={3500} 
  animation="slide" 
  isEnabledAutoplay={true} 
  style={{width:"800px", height:"500px", maxWidth:"100%"}}
>
  <CarouselButton placement="left"/>
  <CarouselButton placement="right"/>
  <CarouselIndicator/>
</Carousel>
```
