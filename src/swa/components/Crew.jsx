import React from "react";
import { altText, message } from "../../messages";
import { assetsUrl } from "../../urls";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import Link from "./Link";

const Crew = ({ crew }) => {
  return (
    <div className="row">
      {crew
        .filter((c) => c.visible)
        .sort((a, b) => a.order - b.order)
        .map((value, i) => (
          <div className="col-lg-3" key={i}>
            <div className="team team-style--bottom">
              <div className="thumbnail">
                <img
                  src={assetsUrl(value.image?.id)}
                  alt={altText(value.image?.description)}
                  loading="lazy"
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="content">
                <h4 className="title">{value.name}</h4>
                <p className="designation">
                  {message(value.translations, "position")}
                </p>
              </div>
              <ul className="social-icon">
                {value.facebook_link ? (
                  <li>
                    <Link to={`${value.facebook_link}`} target="_blank">
                      <FaFacebookF />
                    </Link>
                  </li>
                ) : null}
                {value.twitter_link ? (
                  <li>
                    <Link to={`${value.twitter_link}`} target="_blank">
                      <FaTwitter />
                    </Link>
                  </li>
                ) : null}
                {value.linkedin_link ? (
                  <li>
                    <Link to={`${value.linkedin_link}`} target="_blank">
                      <FaLinkedinIn />
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Crew;
