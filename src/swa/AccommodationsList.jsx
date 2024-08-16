import React, { useEffect, useState } from "react";
import Helmet from "./components/Helmet";
import { directus } from "../directus";
import { altText, message } from "../messages";
import { assetsUrl } from "../urls";
import ContactForm from "./components/ContactForm";
import Link from "./components/Link";
import Loading from "./components/Loading";

const AccommodationsList = () => {
  const [data, setData] = useState();

  useEffect(() => {
    directus
      .items("accommodation_page")
      .readMany({
        fields: [
          "translations.*",
          "bgimage.id",
          "bgimage.description",
          "accommodations.*",
          "accommodations.image_thumb.id",
          "accommodations.image_thumb.description",
          "accommodations.translations.*",
        ],
      })
      .then((r) => setData(r.data));
  }, []);

  if (!data) return <Loading />;

  const pageTranslations = data.translations;
  const accommodations = data.accommodations;

  return (
    <>
      <Helmet
        title={message(pageTranslations, "page_title")}
        description={message(pageTranslations, "page_description")}
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
                  {message(pageTranslations, "header")}
                </h2>
                <p className="description">
                  {message(pageTranslations, "subheader")}
                </p>
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
                className="section-title mb--30 rich-text-content"
                dangerouslySetInnerHTML={{
                  __html: message(pageTranslations, "content"),
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb--120 pt--100">
        <div className="row row-flex service-main-wrapper justify-content-center">
          <div className="text-center">
            {!accommodations.length &&
              message(pageTranslations, "empty_accommodations")}
          </div>

          {accommodations.map((a, i) => (
            <div
              className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pt-0"
              key={"accommodation-" + i}
            >
              <Link to={"/accommodations/" + a.id}>
                <div className="service service__style--2 bg-gray p-0 mb-4 grid">
                  <img
                    src={assetsUrl(a.image_thumb?.id, "height=200")}
                    loading="lazy"
                    alt={altText(a.image_thumb?.description)}
                    style={{
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      height: 200,
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div className="content p-4 text-center">
                    <h3 className="title font--25 color-1">
                      {a.translations?.[0].name}
                    </h3>
                    <p>{a.translations?.[0].subheader}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <ContactForm />
    </>
  );
};

export default AccommodationsList;
