import Slider from "react-slick";

const GallerySlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      <div><img src="../assets/Art1.jpg" alt="Art 1" /></div>
      <div><img src="/img/art2.jpg" alt="Art 2" /></div>
    </Slider>
  );
};

export default GallerySlider;
