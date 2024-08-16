import React, { useEffect, useState } from "react";
import { directus } from "../directus";
import { altText, message } from "../messages";
import { assetsUrl } from "../urls";
import ContactForm from "./components/ContactForm";
import Helmet from "./components/Helmet";
import Link from "./components/Link";
import Loading from "./components/Loading";

const UniversitiesList = () => {
  const [pageData, setPageData] = useState();

  useEffect(() => {
    directus
      .items("universities_page")
      .readMany({
        fields: [
          "bgimage.id",
          "bgimage.description",
          "translations.*",
          "universities.id",
          "universities.translations.name",
          "universities.translations.languages_code",
          "universities.image_thumb.id",
          "universities.image_thumb.description",
        ],
        deep: {
          universities: { _filter: { enabled: { _eq: true } } },
        },
      })
      .then((r) => setPageData(r.data));
  }, []);

  if (!pageData) return <Loading />;

  const translations = pageData.translations;

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
          src={assetsUrl(pageData.bgimage?.id)}
          loading="lazy"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            objectFit: "cover",
            zIndex: -2,
          }}
          alt={altText(pageData.bgimage?.description)}
        />
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="rn-page-title text-center pt--100">
                <h2 className="title text-white">
                  {message(translations, "header")}
                </h2>
                <p className="description">
                  {message(translations, "subheader")}
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
                className="section-title mb--30"
                dangerouslySetInnerHTML={{
                  __html: message(translations, "content"),
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {pageData.universities.length ? (
        <div className="designer-portfolio-area pt--90 pb--120 bg_color--1">
          <div className="container">
            <div className="row row-flex service-main-wrapper justify-content-center">
              {pageData.universities.map((val, i) => (
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12"
                  key={"university-" + i}
                >
                  <Link to={"/universities/" + val.id}>
                    <div className="service service__style--2 bg-gray p-0 mb-4 grid">
                      <img
                        src={assetsUrl(val.image_thumb?.id, "height=200")}
                        loading="lazy"
                        alt={altText(val.image_thumb?.description)}
                        style={{
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                          height: 200,
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div className="content p-4">
                        <h3 className="title font--25 color-1 mb-0 text-center">
                          {message(val.translations, "name")}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : message(translations, "empty_universities") ? (
        <div className="container ptb--120 text-center">
          {message(translations, "empty_universities")}
        </div>
      ) : null}
      <ContactForm />
    </>
  );
};

export default UniversitiesList;
