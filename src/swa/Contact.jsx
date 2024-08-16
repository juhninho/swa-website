import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FiGlobe, FiHeadphones, FiMapPin } from "react-icons/fi";
import { directus } from "../directus";
import { altText, message } from "../messages";
import { assetsUrl } from "../urls";
import ContactForm from "./components/ContactForm";
import Loading from "./components/Loading";

const Contact = () => {
  const [data, setData] = useState();

  useEffect(() => {
    directus
      .items("contact_page")
      .readMany({
        fields: ["translations.*", "bgimage.id", "bgimage.description"],
      })
      .then((r) => setData(r.data));
  }, []);

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
        data-black-overlay="4"
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
      <div className="rn-contact-top-area ptb--120 bg_color--5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div
                className="section-title mb--30 text-center"
                dangerouslySetInnerHTML={{
                  __html: message(translations, "content"),
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="rn-address">
                <div className="icon">
                  <FiHeadphones />
                </div>
                <div
                  className="inner"
                  dangerouslySetInnerHTML={{
                    __html: message(translations, "phone"),
                  }}
                />
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="rn-address">
                <div className="icon">
                  <FiGlobe />
                </div>
                <div
                  className="inner"
                  dangerouslySetInnerHTML={{
                    __html: message(translations, "web"),
                  }}
                />
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="rn-address">
                <div className="icon">
                  <FiMapPin />
                </div>
                <div
                  className="inner"
                  dangerouslySetInnerHTML={{
                    __html: message(translations, "address"),
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      <ContactForm bgColor="" />
    </>
  );
};

export default Contact;
