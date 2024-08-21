import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import ReactDOM from "react-dom";
import cookie from "react-cookies";
import { Helmet } from "react-helmet";

import "./index.scss";

import Homepage from "./swa/Homepage";
import About from "./swa/About";
import Header from "./swa/components/Header";
import Footer from "./swa/components/Footer";
import Contact from "./swa/Contact";
import SchoolPage from "./swa/School";
import SchoolsList from "./swa/SchoolsList";
import CitiesList from "./swa/CitiesList";
import CityPage from "./swa/City";
import OffersList from "./swa/OffersList";
import Offer from "./swa/Offer";
import Blog from "./swa/Blog";
import BlogPost from "./swa/BlogPost";
import UniversitiesList from "./swa/UniversitiesList";
import UniversityPage from "./swa/University";
import AccommodationsList from "./swa/AccommodationsList";
import AccommodationPage from "./swa/Accommodation";
import Hotpage from "./swa/Hotpage";
import CookieConsent from "./swa/components/CookieConsent";
import ScrollToTop from "./swa/components/ScrollToTop";
import Error404 from "./swa/components/Error404";

import { directus } from "./directus";
import { updateSiteLanguage } from "./messages";

export const SUPPORTED_LANGS = ["pt", "es"]

const Root = () => {
  const [cmsData, setCmsData] = useState();

  useEffect(() => {
    directus
      .items("general")
      .readMany({
        fields: [
          "translations.*",
          "facebook_link",
          "instagram_link",
          "youtube_link",
          "logo.id",
          "logo.description",
          "logo_footer.id",
          "logo_footer.description",
        ],
      })
      .then((r) => setCmsData(r.data));
  }, []);

  const setLangCookie = async (lang) => {
    cookie.save("swa-website-lang", lang, {
      domain: window.location.hostname,
      path: "/",
    });

    updateSiteLanguage();
  };

  const getLang = () => {
    let newLang = "pt";

    const langCookie = cookie.load("swa-website-lang");
    if (langCookie) {
      newLang = langCookie;
    } else {
      const browserLang = window.navigator.language?.split("-")?.[0];

      if (SUPPORTED_LANGS.includes(browserLang)) newLang = browserLang;
    }

    return newLang;
  };

  return (
    <>
      <BrowserRouter>
        <Route
          exact
          path="/"
          render={() => {
            return <Redirect to={`/${getLang()}/`} />;
          }}
        />
        <Route
          path="/:lang/"
          render={(props) => {
            if (SUPPORTED_LANGS.includes(props.match.params.lang)) {
              setLangCookie(props.match.params.lang);
              updateSiteLanguage();

              return (
                <>
                  <Helmet>
                    <script async src="https://www.googletagmanager.com/gtag/js?id=G-GSM4W67X8Y"></script>
                  </Helmet>
                  <ScrollToTop />
                  <Header
                    headerPosition="header--static logoresize"
                    logo="all-dark"
                    color="color-black"
                    data={cmsData}
                    lang={props.match.params.lang}
                  />
                  <Switch>
                    <Route exact path={`/:lang/`} component={Homepage} />

                    <Route exact path={`/:lang/about`} component={About} />

                    <Route exact path={`/:lang/contact`} component={Contact} />

                    <Route
                      exact
                      path={`/:lang/schools`}
                      component={SchoolsList}
                    />

                    <Route
                      path={`/:lang/schools/:schoolid`}
                      component={SchoolPage}
                    />

                    <Route
                      exact
                      path={`/:lang/universities`}
                      component={UniversitiesList}
                    />

                    <Route
                      path={`/:lang/universities/:universityid`}
                      component={UniversityPage}
                    />

                    <Route
                      exact
                      path={`/:lang/accommodations`}
                      component={AccommodationsList}
                    />

                    <Route
                      path={`/:lang/accommodations/:accommodationid`}
                      component={AccommodationPage}
                    />

                    <Route
                      exact
                      path={`/:lang/destinations`}
                      component={CitiesList}
                    />

                    <Route
                      path={`/:lang/destinations/:cityid`}
                      component={CityPage}
                    />

                    <Route
                      exact
                      path={`/:lang/offers/`}
                      component={OffersList}
                    />

                    <Route
                      exact
                      path={`/:lang/offers/university`}
                      render={() => <OffersList category="university" />}
                    />

                    <Route
                      exact
                      path={`/:lang/offers/general-english`}
                      render={() => <OffersList category="general-english" />}
                    />

                    <Route path={`/:lang/offers/:offerid`} component={Offer} />

                    <Route path={`/:lang/page/:pageid`} component={Hotpage} />

                    <Route exact path={`/:lang/blog/`} component={Blog} />

                    <Route path={`/:lang/blog/:postid`} component={BlogPost} />

                    <Route
                      path={`/:lang/404`}
                      render={() => <Error404 cmsData={cmsData} />}
                    />

                    <Route render={() => <Error404 cmsData={cmsData} />} />
                  </Switch>
                  <Footer data={cmsData} />
                </>
              );
            } else {
              return (
                <Redirect to={`/${getLang()}${props.location.pathname}`} />
              );
            }
          }}
        />
      </BrowserRouter>

      <CookieConsent data={cmsData} />
    </>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
