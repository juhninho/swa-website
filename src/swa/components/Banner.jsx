import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { altText } from "../../messages";
import { assetsUrl } from "../../urls";

const Banner = ({ title, subtitle, button, bgImage }) => {
  return (
    <div
      className="rn-finding-us-area rn-finding-us ptb--120 bg_color--1 bg_image"
      data-black-overlay="5"
    >
      <img
        src={assetsUrl(bgImage?.id)}
        loading="lazy"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          objectFit: "cover",
          zIndex: -2,
        }}
        alt={altText(bgImage?.description)}
      />
      <div className="container ptb--80">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div className="text-center">
              <h4 className="font-weight-bold text-white font--40 text-center">
                {title}
              </h4>
              <p className="text-light">{subtitle}</p>

              <a
                className="btn-default text-center mt--40"
                href={button.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {button.icon === "FaWhatsapp" ? <FaWhatsapp /> : null}
                <span className="pl--10">{button.text}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
