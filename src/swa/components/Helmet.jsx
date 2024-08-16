import React from "react";
import { Helmet as ReactHelmet } from "react-helmet";
import { siteLanguage } from "../../messages";

export default function Helmet(props) {
  return (
    <React.Fragment>
      <ReactHelmet htmlAttributes={{ lang: siteLanguage }}>
        <meta charSet="utf-8" />
        <title>{(props.title ?? "") + " | SWA International"}</title>
        {
          window.location.host.includes('swainternational.com') ?
            <meta name="robots" content="index, follow" />
            : <meta name="robots" content="none" />
        }
        <meta name="description" content={props.description ?? ""} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </ReactHelmet>
    </React.Fragment>
  );
}


