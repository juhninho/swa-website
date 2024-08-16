import React from "react";
import { FiYoutube } from "react-icons/fi";
import { altText, message } from "../../messages";
import { assetsUrl } from "../../urls";
import { IconFacebook, IconInstagram } from "./Icons";

export default function Footer({ data }) {
  if (!data) return null;

  const SocialShare = [
    {
      Social: <IconFacebook />,
      link: message(data.translations, "facebook_link") ?? data.facebook_link,
    },
    {
      Social: <FiYoutube />,
      link: message(data.translations, "youtube_link") ?? data.youtube_link,
    },
    {
      Social: <IconInstagram />,
      link: message(data.translations, "instagram_link") ?? data.instagram_link,
    },
  ];

  return (
    <div className="footer-style-2 ptb--30 bg_color--6">
      <div className="wrapper plr--50 plr_sm--20">
        <div className="row align-items-center justify-content-between">
          <div className="col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="inner">
              <div
                className="logo text-center text-sm-left mb_sm--20"
                style={{ minWidth: 164 }}
              >
                <a href="/">
                  <img
                    src={assetsUrl(data?.logo_footer?.id)}
                    alt={altText(data?.logo_footer?.description)}
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="inner text-center">
              <ul className="social-share rn-lg-size d-flex justify-content-center liststyle">
                {SocialShare.map((val, i) => (
                  <li key={i}>
                    <a
                      href={`${val.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {val.Social}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-12 col-sm-12 col-12">
            <div className="inner text-lg-right text-center mt_md--20 mt_sm--20">
              <p className="text-white-50">
                Copyright © {new Date().getFullYear()} SWA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};