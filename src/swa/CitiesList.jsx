import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Helmet from "./components/Helmet";
import ContactForm from "./components/ContactForm";
import { directus } from "../directus";
import { assetsUrl } from "../urls";
import { altText, message, siteLanguage } from "../messages";
import Link from "./components/Link";
import Loading from "./components/Loading";

const CitiesTab = ({ countryId, emptyText }) => {
  const [cities, setCities] = useState();

  useEffect(() => {
    directus
      .items("destination")
      .readMany({
        filter: {
          country_id: { _eq: countryId },
          translations: { languages_code: { _eq: siteLanguage } },
        },
        fields: [
          "id",
          "image_thumb.id",
          "image_thumb.description",
          "translations.name",
          "translations.summary",
        ],
      })
      .then((r) => setCities(r.data));
  }, []);

  if (!cities) return <Loading height="60vh" />;

  if (!cities.length)
    return <div className="container ptb--120">{emptyText}</div>;

  return (
    <div className="container pt--40">
      <div className="row row-flex service-main-wrapper justify-content-center">
        {cities.map((val, i) => (
          <div
            className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pt-0"
            key={"destination-" + i}
          >
            <Link to={"/destinations/" + val.id}>
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
                <div className="content p-4 text-center">
                  <h3 className="title font--25 color-1">
                    {val.translations?.[0].name}
                  </h3>
                  <p>{val.translations?.[0].summary}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const CitiesList = () => {
  const [selectTab, setSelectedTab] = useState(0);
  const [data, setData] = useState();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    directus
      .items("destinations_page")
      .readMany({
        fields: [
          "bgimage.id",
          "bgimage.description",
          "translations.*",
          "destinations.id",
          "destinations.image_thumb.id",
          "destinations.image_thumb.description",
          "destinations.translations.languages_code",
          "destinations.translations.name",
          "destinations.translations.summary",
        ],
      })
      .then((r) => setData(r.data));

    directus
      .items("country")
      .readMany({
        fields: ["id", "translations.name", "translations.languages_code"],
        filter: { enabled: { _eq: true } },
      })
      .then((r) => setCountries(r.data));
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
              />
            </div>
          </div>
        </div>
      </div>

      {countries.length ? (
        <div className="designer-portfolio-area ptb--120 bg_color--1">
          <div className="wrapper plr--70 plr_sm--30 plr_md--30">
            <Tabs selectedIndex={selectTab} onSelect={setSelectedTab}>
              <div className="row text-center">
                <div className="col-lg-12">
                  <div className="tablist-inner">
                    <TabList className="pv-tab-button text-center mt--0 justify-content-center">
                      {countries.map((c, i) => (
                        <Tab key={"tab-" + i}>
                          <span>{message(c.translations, "name")}</span>
                        </Tab>
                      ))}
                    </TabList>
                  </div>

                  {countries.map((c, i) => (
                    <TabPanel key={"tabpanel" + i}>
                      <CitiesTab
                        countryId={c.id}
                        emptyText={message(
                          translations,
                          "empty_destinations"
                        )?.replace("$COUNTRY", message(c.translations, "name"))}
                      />
                    </TabPanel>
                  ))}
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      ) : null}

      <ContactForm />
    </>
  );
};

export default CitiesList;
