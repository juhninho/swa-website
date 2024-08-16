import React, { useEffect, useState } from "react";
import { directus } from "../../directus";
import { siteLanguage } from "../../messages";
import Banner from "./Banner";

const OffersBanner = () => {
  const [data, setData] = useState();

  useEffect(() => {
    directus
      .items("offers_page_translations")
      .readMany({
        fields: [
          "banner_bgimage.id",
          "banner_bgimage.description",
          "banner_button_icon",
          "banner_button_link",
          "banner_button_text",
          "banner_subtitle",
          "banner_title",
        ],
        filter: { languages_code: { _eq: siteLanguage } },
      })
      .then((r) => {
        setData(r.data[0]);
      });
  }, []);

  if (!data) return null;

  return (
    <Banner
      title={data.banner_title}
      subtitle={data.banner_subtitle}
      button={{
        link: data.banner_button_link,
        icon: data.banner_button_icon,
        text: data.banner_button_text,
      }}
      bgImage={data.banner_bgimage}
    />
  );
};

export default OffersBanner;
