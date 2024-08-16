import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { directus } from "../directus";
import { altText, message } from "../messages";
import { assetsUrl } from "../urls";
import ContactForm from "./components/ContactForm";
import Helmet from "./components/Helmet";
import Loading from "./components/Loading";
import PackagesSlider from "./components/PackagesSlider";
import { SchoolPicturesCarousel } from "./components/carousel";

const UniversityPage = () => {
  let { universityid } = useParams();

  const [selectedOffer, setSelectedOffer] = useState();

  const [data, setData] = useState();
  const [offers, setOffers] = useState([]);
  const [subject, setSubject] = useState();

  useEffect(() => {
    directus
      .items("university")
      .readOne(universityid, {
        fields: [
          "bgimage.id",
          "website",
          "bgimage.description",
          "gallery.directus_files_id.id",
          "gallery.directus_files_id.description",
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
          "universities.university_id.destination",
          "translations.languages_code",
          "translations.name",
          "translations.card_description",
        ],
        filter: { universities: { university_id: { _eq: universityid } } },
      })
      .then((r) => {
        setOffers(r.data);
      });
  }, [universityid]);

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
          src={assetsUrl(data.bgimage?.id)}
          loading="lazy"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            objectFit: "cover",
            zIndex: -2,
          }}
          alt={altText(data.bgimage?.description)}
        />
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="rn-page-title text-center pt--100">
                <h2 className="title text-white">
                  {message(translations, "name")}
                </h2>
                <p>{message(translations, "subheader")}</p>
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
                className="feature-area section-title city-content-area rich-text-content"
                dangerouslySetInnerHTML={{
                  __html: message(translations, "content"),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container pb--120 hide-if-empty">
        {data.gallery?.length ? (
          <div className="slider-wrapper">
            <div className="slider-activation">
              <Slider
                className="rn-slick-dot dot-light"
                {...SchoolPicturesCarousel}
              >
                {data.gallery?.map((value, index) => (
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
        ) : null}

        {message(translations, "extra_info") ? (
          <div
            className="pt--120 hide-if-empty rich-text-content"
            dangerouslySetInnerHTML={{
              __html: message(translations, "extra_info"),
            }}
          />
        ) : null}

        {data.website && message(translations, "website_button_text") ? (
          <div className="portfolio-details-btn mt--100 text-center">
            <a
              className="btn-default btn-border"
              href={data.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              {message(translations, "website_button_text")}
            </a>
          </div>
        ) : null}

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

export default UniversityPage;
