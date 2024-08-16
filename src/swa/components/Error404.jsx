import React from "react";
import { message } from "../../messages";
import Link from "./Link";
import Loading from "./Loading";

const Error404 = ({ cmsData }) => {
  if (!cmsData) return <Loading />;

  const translations = cmsData.translations;

  return (
    <div className="error-page-inner bg_color--3">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="inner">
              <h1 className="title">404!</h1>
              <h3 className="sub-title text-dark">
                {message(translations, "not_found_title")}
              </h3>
              <span className="text-dark">
                {message(translations, "not_found_subtitle")}
              </span>
              <div className="error-button">
                <Link className="btn-default" href="/">
                  {message(translations, "not_found_button_text")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;
