import React, { useState } from "react";
import Slider from "react-slick";
import { useEffect } from "react";
import { directus } from "../../directus";
import { assetsUrl } from "../../urls";
import { altText, siteLanguage } from "../../messages";

const mainCarousel = {
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  dots: true,
  arrows: true,
  fade: true,
  easing: "fade",
  adaptiveHeight: true,
  lazyLoad: true,
  // autoplay: true,
  // autoplaySpeed: 5000,
};

const MainCarousel = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    directus
      .items("carousel")
      .readMany({
        fields: [
          "show",
          "title",
          "subtitle",
          "image.id",
          "image.description",
          "mobile_image.id",
          "mobile_image.description",
          "use_button",
          "action_text",
          "action_link",
          "language",
        ],
        filter: {
          _and: [{ language: { _eq: siteLanguage } }, { show: { _eq: true } }],
        },
      })
      .then((r) => setItems(r.data));
  }, []);

  if (!items.length) return null;

  const getPostImg = (value) => {
    if (window.innerWidth <= 500) {
      return {
        id: value.mobile_image?.id ?? value.image?.id,
        alt: value.mobile_image?.description ?? value.image?.description,
      };
    }

    return {
      id: value.image?.id,
      alt: value.image?.description,
    };
  };

  return (
    <div className="slider-wrapper">
      <div className="slider-activation">
        <Slider className="rn-slick-dot dot-light" {...mainCarousel}>
          {items.map((value, index) => {
            const img = getPostImg(value);
            return (
              <div key={index}>
                <a
                  href={value.use_button ? undefined : value.action_link}
                  className={`slide slide-style-2 slider-box-content without-overlay d-flex align-items-center justify-content-center bg_image`}
                  data-black-overlay="2"
                  style={{
                    willChange: "contents",
                    height: "100%",
                  }}
                >
                  <img
                    src={assetsUrl(
                      img.id,
                      `width=${Math.max(window.innerWidth, 600)}`
                    )}
                    loading="lazy"
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      top: 0,
                      objectFit: "cover",
                      zIndex: -2,
                    }}
                    alt={altText(img.alt)}
                  />
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="inner text-left">
                          {value.title ? (
                            <h1 className="title ">{value.title}</h1>
                          ) : (
                            ""
                          )}
                          {value.subtitle ? (
                            <p className="description">{value.subtitle}</p>
                          ) : (
                            ""
                          )}
                          {value.action_text ? (
                            <div className="slide-btn">
                              <a
                                className="btn-default btn-hover-fade"
                                href={`${value.action_link}`}
                              >
                                {value.action_text}
                              </a>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default MainCarousel;
