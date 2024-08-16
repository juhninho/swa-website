import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Helmet from "./components/Helmet";
import ContactForm from "./components/ContactForm";
import Slider from "react-slick";
import { SchoolPicturesCarousel } from "./components/carousel";
import { useEffect } from "react";
import { directus } from "../directus";
import { altText, message } from "../messages";
import { assetsUrl } from "../urls";
import PackagesSlider from "./components/PackagesSlider";
import Icon from "./components/Icon";
import Loading from "./components/Loading";

const CityPage = () => {
  let { cityid } = useParams();

  const [selectedOffer, setSelectedOffer] = useState();

  const [data, setData] = useState();
  const [offers, setOffers] = useState([]);
  const [subject, setSubject] = useState();

  useEffect(() => {
    directus
      .items("destination")
      .readOne(cityid, {
        fields: [
          "image.id",
          "image.description",
          "galery.directus_files_id.id",
          "galery.directus_files_id.description",
          "translations.*",
        ],
      })
      .then(
        (r) => setData(r),
        () => window.location.replace("/404")
      );

    directus
      .items("offers")
      .readMany({
        fields: [
          "id",
          "card_price",
          "schools.school_id.destination",
          "translations.languages_code",
          "translations.name",
          "translations.card_description",
        ],
        filter: { schools: { school_id: { destination: { _eq: cityid } } } },
      })
      .then((r) => {
        setOffers(r.data);
      });
  }, [cityid]);

  if (!data) return <Loading />;

  const translations = data.translations;

  return (
    <>
      <Helmet
        title={message(translations, "page_title")}
        description={message(translations, "page_description")}
      />
      <div
        className="rn-page-title-area pt--120 pb--190 bg_image bg_image--15"
        data-black-overlay="1"
      >
        <img
          src={assetsUrl(data.image?.id)}
          loading="lazy"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            objectFit: "cover",
            zIndex: -2,
          }}
          alt={altText(data.image?.description)}
        />
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="rn-page-title text-center pt--100">
                <h2 className="title text-white">
                  {message(translations, "name")}
                </h2>
                <p>{message(translations, "summary")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div
          className="service-area creative-service-wrapper bg_color--1 "
          id="service"
        >
          <div className="ptb--80">
            <div className="row container">
              <div
                className="feature-area section-title city-content-area"
                dangerouslySetInnerHTML={{
                  __html: message(translations, "content"),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {message(translations, "title") ? (
        <div className="bg_color--5 ptb--100">
          <div className="container">
            <h3 className="title fontWeight500 lineheight--1-8">
              {message(translations, "title")}
            </h3>
            <div className="row service-one-wrapper">
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt--30">
                <div className="service service__style--1">
                  <Icon id={message(translations, "icon_1")} />

                  <div className="content mt--20">
                    <p>{message(translations, "description_1")}</p>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt--30">
                <div className="service service__style--1">
                  <Icon id={message(translations, "icon_2")} />

                  <div className="content mt--20">
                    <p>{message(translations, "description_2")}</p>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt--30">
                <div className="service service__style--1">
                  <Icon id={message(translations, "icon_3")} />

                  <div className="content mt--20">
                    <p>{message(translations, "description_3")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="container pb--120">
        <div className="slider-wrapper pt--120">
          <div className="slider-activation">
            <Slider
              className="rn-slick-dot dot-light"
              {...SchoolPicturesCarousel}
            >
              {data.galery.map((value, index) => (
                <div key={index}>
                  <div
                    className="slide slide-style-2 slider-box-content without-overlay d-flex align-items-center justify-content-center"
                    style={{
                      willChange: "contents",
                    }}
                  >
                    <img
                      src={assetsUrl(value.directus_files_id?.id)}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        objectFit: "cover",
                        zIndex: -2,
                        borderRadius: 10,
                      }}
                      alt={altText(value.directus_files_id?.description)}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        <div
          className="pt--120 rich-text-content"
          dangerouslySetInnerHTML={{
            __html: message(translations, "extra_info"),
          }}
        />

        <PackagesSlider
          title={message(translations, "offers_title")}
          buttonText={message(translations, "offers_button_text")}
          selectedOffer={selectedOffer}
          onSelectOffer={(i, subject) => {
            setSelectedOffer(i);
            setSubject(subject);
          }}
          offers={offers}
        />
      </div>

      <ContactForm subject={subject} />
    </>
  );
};

export default CityPage;
