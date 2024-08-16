import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Helmet from "./components/Helmet";
import ContactForm from "./components/ContactForm";
import { useEffect } from "react";
import { directus } from "../directus";
import { altText, message } from "../messages";
import { assetsUrl } from "../urls";
import Banner from "./components/Banner";
import Loading from "./components/Loading";

const Hotpage = () => {
  let { pageid } = useParams();

  const [data, setData] = useState();

  useEffect(() => {
    directus
      .items("hotpages")
      .readOne(pageid, {
        fields: [
          "bgimage.id",
          "bgimage.description",
          "enabled",
          "translations.*",
          "translations.banner_bgimage.id",
          "translations.banner_bgimage.description",
        ],
      })
      .then(
        (r) => {
          if (!r.enabled) {
            window.location.replace("/404");
          }
          setData(r);
        },
        () => window.location.replace("/404")
      );
  }, [pageid]);

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
                  {message(translations, "header")}
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

      {message(translations, "banner_title") ? (
        <Banner
          title={message(translations, "banner_title")}
          subtitle={message(translations, "banner_subtitle")}
          button={{
            icon: message(translations, "banner_button_icon"),
            link: message(translations, "banner_button_link"),
            text: message(translations, "banner_button_text"),
          }}
          bgImage={message(translations, "banner_bgimage")}
        />
      ) : null}
      <ContactForm />
    </>
  );
};

export default Hotpage;
