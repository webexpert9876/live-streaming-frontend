import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SimpleSlider() {
  var settings = {
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 3,
    centerMode: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 1
        }
      }
    ]
    // asNavFor: '.slider-nav'
  };
  // var sliderNav = {
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  //   asNavFor: '.slider-for',
  //   dots: true,
  //   centerMode: true,
  //   focusOnSelect: true
  // };
  
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <Slider {...settings}>
        <div>
          <h3>1</h3>
          <img src="http://kenwheeler.github.io/slick/img/lazyfonz2.png" alt="Slide 1" />
        </div>
        <div>
          <h3>2</h3>
          <img src="http://kenwheeler.github.io/slick/img/lazyfonz3.png" alt="Slide 2" />
        </div>
        <div>
          <h3>3</h3>
          <img src="http://kenwheeler.github.io/slick/img/lazyfonz3.png" alt="Slide 3" />
        </div>
        <div>
          <h3>4</h3>
          <img src="http://kenwheeler.github.io/slick/img/lazyfonz3.png" alt="Slide 4" />
        </div>
        <div>
          <h3>5</h3>
          <img src="http://kenwheeler.github.io/slick/img/lazyfonz3.png" alt="Slide 5" />
        </div>
        <div>
          <h3>6</h3>
          <img src="http://kenwheeler.github.io/slick/img/lazyfonz3.png" alt="Slide 6" />
        </div>
      </Slider>
    </div>
  );
}
