import React, { useEffect, useState } from "react";
import Helmet from "./components/Helmet";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ContactForm from "./components/ContactForm";
import { directus } from "../directus";
import { altText, message, siteLanguage } from "../messages";
import { assetsUrl } from "../urls";
import Link from "./components/Link";
import Loading from "./components/Loading";

const SchoolsTab = ({ countryId, emptyText }) => {
  const [schools, setSchools] = useState();

  useEffect(() => {
    directus
      .items("school")
      .readMany({
        fields: [
          "id",
          "name",
          "category",
          "image_thumb.id",
          "image_thumb.description",
          "translations.name",
          "translations.languages_code",
        ],
        filter: {
          enabled: { _eq: true },
          destination: { country_id: { _eq: countryId } },
          translations: { languages_code: { _eq: siteLanguage } },
        },
      })
      .then((r) => {
        setSchools(r.data);
      });
  }, [countryId]);

  if (!schools) return <div className="container ptb--120"></div>;

  if (!schools.length)
    return <div className="container ptb--120">{emptyText}</div>;

  return (
    <div className="container pt--40">
      <div className="row row-flex service-main-wrapper justify-content-center">
        {schools.map((val, i) => (
          <div
            className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pt-0"
            key={"school-" + i}
          >
            <Link to={"/schools/" + val.id}>
              <div className="service service__style--2 bg-gray mb-4 grid p-0">
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
  );
};

const SchoolsList = () => {
  const [selectTab, setSelectedTab] = useState(0);
  const [pageData, setPageData] = useState();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    directus
      .items("schools_page")
      .readMany({
        fields: ["bgimage.id", "bgimage.description", "translations.*"],
      })
      .then((r) => setPageData(r.data));

    directus
      .items("country")
      .readMany({
        fields: ["id", "translations.name", "translations.languages_code"],
        filter: { enabled: { _eq: true } },
      })
      .then((r) => setCountries(r.data));
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
                      <SchoolsTab
                        countryId={c.id}
                        emptyText={message(
                          translations,
                          "empty_schools"
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

export default SchoolsList;
