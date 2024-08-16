import React from "react";
import { assetsUrl } from "../../urls";
import { altText, message } from "../../messages";
import Link from "./Link";

const OfferCards = ({ offers, cardButtonText }) => {
  return (
    <div className="row service-main-wrapper justify-content-md-center text-left">
      {offers.map((val, i) => (
        <div
          className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
          key={"services" + i}
        >
          <Link to={`/offers/${val.id}`}>
            <div
              className="service service__style--2 bg-gray p-0"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img
                src={assetsUrl(val.imagem_thumb?.id, "height=200")}
                loading="lazy"
                alt={altText(val.imagem_thumb?.description)}
                style={{
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  height: 240,
                  width: "100%",
                  objectFit: "cover",
                }}
              />
              <div className="content pt-4 pb-0" style={{ flexGrow: 1 }}>
                <h3 className="title font--25 color-1">
                  {message(val.translations, "name")}
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: message(val.translations, "card_description"),
                  }}
                />
              </div>
              <div
                className="content about-button w-100 pt--0"
                style={{
                  textAlign: "center",
                  flexGrow: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                }}
              >
                <h4 className="text-color-primary font-weight-bold mt--20">
                  {val.card_price}
                </h4>
                <button
                  className="btn-default w-100 mt--10"
                  href={`offers/${val.id}`}
                >
                  {cardButtonText}
                </button>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default OfferCards;
