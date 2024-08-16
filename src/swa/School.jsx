import React, { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { directus } from "../directus";
import { altText, message } from "../messages";
import { assetsUrl } from "../urls";
import ContactForm from "./components/ContactForm";
import Helmet from "./components/Helmet";
import Loading from "./components/Loading";
import PackagesSlider from "./components/PackagesSlider";

const SchoolPicturesCarousel = {
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  dots: false,
  arrows: true,
  fade: true,
  easing: "fade",
  adaptiveHeight: false,
  lazyLoad: true,
  autoplay: true,
  autoplaySpeed: 3000,
};

const SchoolPage = () => {
  let { schoolid } = useParams();

  const [selectedOffer, setSelectedOffer] = useState();
  const [school, setSchool] = useState();
  const [subject, setSubject] = useState();

  useEffect(() => {
    window.gtag('event', 'conversion', { 'send_to': 'AW-805507335/flKPCM2y174DEIeijIAD', 'school_id': schoolid })

    directus
      .items("school")
      .readOne(schoolid, {
        fields: [
          "enabled",
          "image.id",
          "image.description",
          "category",
          "website",
          "translations.*",
          "galery.directus_files_id.id",
          "galery.directus_files_id.description",
          "offers.offers_id.id",
          "offers.offers_id.",
          "offers.offers_id.translations.name",
          "offers.offers_id.translations.card_description",
          "offers.offers_id.card_price",
          "offers.offers_id.translations.languages_code",
        ],
      })
      .then(
        (r) => {
          if (!r.enabled) window.location.replace("/404");
          setSchool(r);
        },
        () => window.location.replace("/404")
      );
  }, [schoolid]);

  if (!school) return <Loading />;

  const translations = school.translations;
  const offers = school.offers.map((o) => o.offers_id) ?? [];

  return (
    <>
      <Helmet
        title={message(translations, "page_title")}
        description={message(translations, "page_description")}
      />
      <div
        className="rn-page-title-area pt--120 pb--190 bg_image bg_image--15"
        data-black-overlay="2"
      >
        <img
          src={assetsUrl(school.image?.id)}
          loading="lazy"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            objectFit: "cover",
            zIndex: -2,
          }}
          alt={altText(school.image?.description)}
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
      <div className="rn-portfolio-details ptb--120 bg_color--1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="portfolio-details">
                <div className="row row--35 mb--50 justify-content-between">
                  <div className="col-lg-6">
                    <div className="inner">
                      <div
                        className="section-title rich-text-content"
                        dangerouslySetInnerHTML={{
                          __html: message(translations, "content"),
                        }}
                      />

                      {school.website &&
                        message(translations, "website_button_text") ? (
                        <div className="portfolio-details-btn mt--30">
                          <a
                            className="btn-default btn-border"
                            href={school.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {message(translations, "website_button_text")}
                          </a>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="portfolio-details-accordion mt_md--40 mt_sm--40">
                      <div
                        className="inner rich-text-content"
                        dangerouslySetInnerHTML={{
                          __html: message(translations, "conditions"),
                        }}
                      ></div>
                    </div>

                    <div
                      className="service-main-wrapper"
                      style={{ display: "flex" }}
                    >
                      {message(translations, "card_1") ? (
                        <div className="col-lg-6 pl--0">
                          <div className="service service__style--2 text-center bg-gray">
                            <div
                              className="content"
                              style={{ paddingTop: 20, paddingBottom: 20 }}
                            >
                              <div className="icon">
                                <FiClock />
                              </div>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: message(translations, "card_1"),
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {message(translations, "card_2") ? (
                        <div className="col-lg-6 pl--0">
                          <div className="service service__style--2 text-center bg-gray">
                            <div
                              className="content"
                              style={{ paddingTop: 20, paddingBottom: 20 }}
                            >
                              <div className="icon">
                                <FiClock />
                              </div>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: message(translations, "card_2"),
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="slider-wrapper pt--120">
            <div className="slider-activation">
              <Slider
                className="rn-slick-dot dot-light"
                {...SchoolPicturesCarousel}
              >
                {school.galery.map((value, index) => (
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
            className="pt--120"
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
      </div>

      <ContactForm subject={subject} />
    </>
  );
};

export default SchoolPage;
