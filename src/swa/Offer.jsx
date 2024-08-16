import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { directus } from "../directus";
import { altText, message } from "../messages";
import { assetsUrl } from "../urls";
import ContactForm from "./components/ContactForm";
import Helmet from "./components/Helmet";
import Icon from "./components/Icon";
import Link from "./components/Link";
import Loading from "./components/Loading";
import OffersBanner from "./components/OffersBanner";

const Offer = () => {
  let { offerid } = useParams();

  const [offer, setOffer] = useState();
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    directus
      .items("offers")
      .readOne(offerid, {
        fields: [
          "category",
          "card_price",
          "image.id",
          "image.description",
          "translations.languages_code",
          "translations.page_title",
          "translations.page_description",
          "translations.name",
          "translations.subheader",
          "translations.content",
          "translations.available_schools",
        ],
      })
      .then(
        (r) => {
          setOffer(r);
        },
        () => {
          window.location.replace("/404");
        }
      );
  }, [offerid]);

  useEffect(() => {
    if (!offer) return;

    if (offer.category === "school") {
      directus
        .items("offers")
        .readOne(offerid, {
          fields: [
            "schools.school_id.id",
            "schools.school_id.image_thumb.id",
            "schools.school_id.image_thumb.description",
            "schools.school_id.translations.languages_code",
            "schools.school_id.translations.name",
          ],
          deep: {
            schools: { _filter: { school_id: { enabled: { _eq: true } } } },
          },
        })
        .then((r) => {
          setInstitutions(r.schools.map((x) => x.school_id));
        });
    } else if (offer.category === "university") {
      directus
        .items("offers")
        .readOne(offerid, {
          fields: [
            "universities.university_id.id",
            "universities.university_id.image_thumb.id",
            "universities.university_id.image_thumb.description",
            "universities.university_id.translations.languages_code",
            "universities.university_id.translations.name",
          ],
          deep: {
            universities: {
              _filter: {
                university_id: {
                  enabled: {
                    _eq: true,
                  },
                },
              },
            },
          },
        })
        .then((r) => {
          setInstitutions(r.universities.map((x) => x.university_id));
        });
    }
  }, [offer]);

  if (!offer) return <Loading />;

  const translations = offer.translations;

  return (
    <>
      <Helmet
        title={message(translations, "page_title")}
        description={message(translations, "page_description")}
      />
      <div
        className="rn-page-title-area pt--120 pb--190 bg_image bg_image--15"
        data-black-overlay="3"
      >
        <img
          src={assetsUrl(offer.image?.id)}
          loading="lazy"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            objectFit: "cover",
            zIndex: -2,
          }}
          alt={altText(offer.image?.description)}
        />
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="rn-page-title text-center pt--100">
                <h2 className="title text-white">
                  {message(translations, "name")}
                </h2>
                <p className="description">
                  {message(translations, "subheader")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ptb--120">
        <div className="container">
          <div className="row" style={{ alignItems: "flex-start" }}>
            <div
              className={`rich-text-content pb-4 ${offer.card_price ? "col-lg-9" : "col-lg-12"
                }`}
              dangerouslySetInnerHTML={{
                __html: message(translations, "content"),
              }}
            />
            {offer.card_price ? (
              <div className="service-main-wrapper col-lg-3">
                <div className="service service__style--2 mt-0 bg-gray">
                  <div className="icon pt-4 pb-0">
                    <Icon id="tags" />
                  </div>

                  <h3
                    className="text-center font--30 pb-4"
                    style={{ color: "#343a40" }}
                  >
                    {offer.card_price}
                  </h3>
                </div>
              </div>
            ) : null}
          </div>
          {institutions.length ? (
            <div>
              <h3>{message(translations, "available_schools")}</h3>
              <div className="row row-flex service-main-wrapper justify-content-center pt--40">
                {institutions.map((val, i) => {
                  return (
                    <div
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12"
                      key={"school-" + i}
                    >
                      <Link
                        to={`${offer.category === "school"
                            ? "/schools/"
                            : "/universities/"
                          }${val.id}`}
                      >
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
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <OffersBanner />

      <ContactForm />
    </>
  );
};

export default Offer;
