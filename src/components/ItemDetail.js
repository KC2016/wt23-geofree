import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SearchButton from "./SearchButton";
import { Box, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  // Fetching item with specific id

  useEffect(() => {
    fetch(`https://geofree.pythonanywhere.com/api/item-detail/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setItem(data);
      })
      .catch((e) => {
        console.log("ERROR", e);
      });
  }, [id]);

  // If unavailable

  if (!item) {
    return <div>Loading...</div>;
  }

  // Display arrows

  const PrevArrow = (props) => {
    const { className, onClick } = props;
    return (
      <div
        className={className}
        style={{
          display: "block",
          color: "#FFFFFF",
          zIndex: 999,
          left: "20px",
        }}
        onClick={onClick}
      ></div>
    );
  };

  const NextArrow = (props) => {
    const { className, onClick } = props;
    return (
      <div
        className={className}
        style={{
          display: "block",
          color: "#000000",
          zIndex: 999,
          right: "20px",
        }}
        onClick={onClick}
      ></div>
    );
  };

  // Slider settings

  const settings = {
    arrows: true,
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  // If error

  const onError = (error) => {
    return console.log("Error loading image", error);
  };

  return (
    <div>
      <SearchButton />

      {/* Image slider */}

      <Slider {...settings} prevArrow={<PrevArrow />} nextArrow={<NextArrow />}>
        {item.images.map((image, index) => (
          <Box
            key={index}
            component="img"
            sx={{
              maxHeight: 400,
              height: "100%",
              border: 1,
              borderColor: "border.main",
              objectFit: "cover",
              display: "block",
            }}
            alt="donated items"
            src={`https://geofree.pythonanywhere.com${image.image}`}
            onError={onError}
          />
        ))}
      </Slider>

      {/* Item information */}

      <Box sx={{ p: 5 }} width="100%">
        <div key={item.id}>
          <Typography variant="h5">{item.title}</Typography>

          <Typography variant="body1">{item.description}</Typography>
          <Typography variant="body1">Condition: {item.condition}</Typography>
          <Typography variant="body1">Category: {item.categories}</Typography>
          <Typography variant="body1">Location</Typography>
        </div>
      </Box>
    </div>
  );
};

export default ItemDetail;
