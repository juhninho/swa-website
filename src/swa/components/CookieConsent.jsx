import React, { useEffect, useState } from "react";
import cookie from "react-cookies";
import { siteLanguage } from "../../messages";

const CookieConsent = ({ data }) => {
  const [consent, setConsent] = useState();

  useEffect(() => {
    const retrievedCookie = cookie.load("swa_cookie_consent");

    setConsent(Boolean(retrievedCookie));
  }, []);

  const setConsentCookie = () => {
    cookie.save("swa_cookie_consent", true, {
      domain: window.location.hostname,
      path: "/",
    });
    setConsent(true);
  };

  if (!data || consent === undefined || consent === true) return null;

  const translations = data.translations?.filter(t => t.languages_code === siteLanguage)[0]

  return (
    <div
      className="col"
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        bottom: 0,
        padding: 20,
        backgroundColor: "var(--color-gray)",
        zIndex: 99999,
      }}
    >
      <span className="text-white font--15 ptb-">
        {translations?.gpdr_message}
      </span>
      <span className="float-right">
        <a
          className="btn btn-default size-sm mr-2 btn-hover-fade"
          href="/page/privacy-policy"
          target="_blank"
        >
          {translations?.gpdr_privacy_policy_button}
        </a>
        <button
          className="btn btn-default size-sm btn-hover-fade"
          onClick={setConsentCookie}
        >
          {translations?.gpdr_agree_button}
        </button>
      </span>
    </div>
  );
};

export default CookieConsent;
