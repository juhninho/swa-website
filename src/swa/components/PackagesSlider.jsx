import React from "react";
import Slider from "react-slick";
import Link from "./Link";
import { message } from "../../messages";
import { directus } from "../../directus";

const slickDotOffers = {
  infinite: false,
  slidesToShow: 3,
  slidesToScroll: 3,
  dots: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 993,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 580,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 481,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const PackagesSlider = ({
  title,
  offers,
  buttonText,
  selectedOffer,
  onSelectOffer,
}) => {
  if (!offers || !offers.length) return null;

  return (
    <div className="pt--120">
      <h3 className="title color-1 text-center pb--20">{title}</h3>
      <div className="rn-blog-area" id="offers" style={{ marginBottom: -30 }}>
        <div className="container">
          <div className="row mt--10 rn-slick-dot slick-space-gutter--15 slickdot--20 row--0">
            <div className="col-12 service-main-wrapper">
              <Slider {...slickDotOffers}>
                {offers
                  .filter((x) => x)
                  .map((val, i) => (
                    <div key={"services" + i}>
                      <div
                        className={`service service__style--2 bg-gray p-0 mb-4 ${
                          selectedOffer === i ? "selected" : ""
                        }`}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <div
                          className="content pt-6 pb-0"
                          style={{ flexGrow: 1 }}
                        >
                          <h3 className="title font--25 color-1">
                            <Link to={`/offers/${val.id}`}>
                              {message(val.translations, "name")}
                            </Link>
                          </h3>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: message(
                                val.translations,
                                "card_description"
                              ),
                            }}
                          />
                        </div>
                        <div
                          className="about-button content w-100 pt-0"
                          style={{
                            textAlign: "center",
                            flexGrow: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-end",
                          }}
                        >
                          <h4 className="text-color-primary font-weight-bold mt--20">
                            {val.card_price}
                          </h4>
                          <button
                            className="btn-default w-100 mt--10"
                            onClick={() => {
                              window.setTimeout(() => {
                                document
                                  .getElementById("contact-form-name")
                                  .focus();
                                document
                                  .getElementById("contact-form-name")
                                  .scrollIntoView({ behavior: "smooth" });
                              }, 500);

                              directus
                                .items("offers_page")
                                .readMany({
                                  fields: [
                                    "translations.contact_subject",
                                    "translations.languages_code",
                                  ],
                                })
                                .then((r) => {
                                  onSelectOffer(
                                    i,
                                    message(
                                      r.data.translations,
                                      "contact_subject"
                                    ).replace(
                                      "$NAME",
                                      message(offers[i].translations, "name")
                                    )
                                  );
                                });
                            }}
                          >
                            {buttonText}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesSlider;
