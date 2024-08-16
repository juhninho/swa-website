import React, { useEffect, useRef, useState } from "react";
import Helmet from "./components/Helmet";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { directus } from "../directus";
import Pagination from "./components/Pagination";
import { altText, message, siteLanguage, getLangId } from "../messages";
import { assetsUrl } from "../urls";
import ContactForm from "./components/ContactForm";
import Loading from "./components/Loading";
import OffersBanner from "./components/OffersBanner";
import OfferCards from "./components/OffersCards";

const ITEMS_PER_PAGE = 9;

const ROUTES = ["general-english", "university"];

const OffersTab = ({ categoryId, emptyText, cardButtonText }) => {
  const [offers, setOffers] = useState();
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const topRef = useRef(null);

  useEffect(() => {
    directus
      .items("offers")
      .readMany({
        filter: {
          category: { _eq: categoryId },
        },
        fields: [
          "id",
          "imagem_thumb.id",
          "imagem_thumb.description",
          "card_price",
          "translations.name",
          "translations.card_description",
          "translations.languages_code",
        ],
        deep: {
          translations: { _filter: { languages_code: { _eq: siteLanguage } } },
        },
        meta: ["filter_count"],
        offset: page * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
      })
      .then((r) => {
        setOffers(r.data);
        setTotal(r.meta.filter_count);
      });
  }, [page]);

  if (!offers) return <Loading />;

  if (total === 0) return <div className="container ptb--120">{emptyText}</div>;

  return (
    <div ref={topRef}>
      <OfferCards offers={offers} cardButtonText={cardButtonText} />

      <div className="pt--80">
        <Pagination
          page={page}
          total={total}
          itemsPerPage={ITEMS_PER_PAGE}
          setPage={(page) => {
            topRef && topRef.current && topRef.current.scrollIntoView();
            setPage(page);
          }}
        />
      </div>
    </div>
  );
};

const OffersList = ({ category = ROUTES[0] }) => {
  const [data, setData] = useState();
  const [selectedTab, setSelectedTab] = useState(
    category === ROUTES[0] ? 0 : 1
  );

  useEffect(() => {
    directus
      .items("offers_page")
      .readMany({
        fields: [
          "translations.card_button_text",
          "translations.languages_code",
          "translations.page_description",
          "translations.page_title",
          "translations.title",
          "translations.subtitle",
          "translations.no_offers",
          "translations.schools_name",
          "translations.universities_name",
          "bgimage.id",
          "bgimage.description",
        ],
      })
      .then((r) => setData(r.data));
  }, []);

  if (!data) return <Loading />;

  const pageTranslations = data.translations;

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
                  {message(pageTranslations, "title")}
                </h2>
                <p className="description">
                  {message(pageTranslations, "subtitle")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="ptb--120">
          <Tabs
            selectedIndex={selectedTab}
            onSelect={(idx) => {
              window.history.replaceState(
                null,
                null,
                `/${getLangId()}/offers/${ROUTES[idx]}`
              );
              setSelectedTab(idx);
            }}
          >
            <div className="row">
              <div className="col-lg-12 text-center">
                <div className="tablist-inner">
                  <TabList className="pv-tab-button text-center mt--0 justify-content-center mb--80">
                    <Tab key={"tab-general-english"}>
                      <span>{message(pageTranslations, "schools_name")}</span>
                    </Tab>
                    <Tab key={"tab-universities"}>
                      <span>
                        {message(pageTranslations, "universities_name")}
                      </span>
                    </Tab>
                  </TabList>
                </div>

                {["school", "university"].map((categoryId, idx) => (
                  <TabPanel key={idx}>
                    <OffersTab
                      categoryId={categoryId}
                      emptyText={message(pageTranslations, "no_offers")}
                      cardButtonText={message(
                        pageTranslations,
                        "card_button_text"
                      )}
                    />
                  </TabPanel>
                ))}
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      <OffersBanner />

      <ContactForm />
    </>
  );
};

export default OffersList;
