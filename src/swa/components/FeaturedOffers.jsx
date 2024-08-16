import React, { useState, useEffect } from "react";
import { directus } from "../../directus";
import OfferCards from "./OffersCards";

const FeaturedOffers = ({ cardButtonText }) => {
  const [featuredOffers, setFeaturedOffers] = useState();

  useEffect(() => {
    directus
      .items("offers")
      .readMany({
        filter: { featured: { _eq: true } },
        limit: 3,
        fields: [
          "id",
          "card_price",
          "imagem_thumb.id",
          "imagem_thumb.description",
          "translations.name",
          "translations.card_description",
          "translations.languages_code",
        ],
      })
      .then((r) => {
        setFeaturedOffers(r.data);
      });
  }, []);

  if (!featuredOffers) return null;

  return <OfferCards offers={featuredOffers} cardButtonText={cardButtonText} />;
};

export default FeaturedOffers;
