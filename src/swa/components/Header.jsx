import React, { Component } from "react";

import {
  IconClose,
  IconFacebook,
  IconInstagram,
  IconMenu,
} from "./Icons";

import { FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

import { SUPPORTED_LANGS } from "../..";
import { altText, message } from "../../messages";
import { assetsUrl } from "../../urls";

class HeaderFive extends Component {
  constructor(props) {
    super(props);
    this.menuTrigger = this.menuTrigger.bind(this);
    this.CLoseMenuTrigger = this.CLoseMenuTrigger.bind(this);
  }
  menuTrigger() {
    document.querySelector(".header-wrapper").classList.toggle("menu-open");
  }
  CLoseMenuTrigger() {
    document.querySelector(".header-wrapper").classList.remove("menu-open");
  }

  render() {
    const { color, headerPosition, data, lang } = this.props;

    if (!data) return null;

    var elements = document.querySelectorAll(".has-dropdown > a");
    for (var i in elements) {
      if (elements.hasOwnProperty(i)) {
        elements[i].onclick = function () {
          this.parentElement
            .querySelector(".submenu")
            .classList.toggle("active");
          this.classList.toggle("open");
        };
      }
    }

    let logo = (
      <img
        src={assetsUrl(data?.logo.id)}
        alt={altText(data?.logo?.description)}
      />
    );

    return (
      <header
        className={`header-area formobile-menu ${headerPosition} ${color}`}
      >
        <div className="header-wrapper" id="header-wrapper">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-1 col-md-3 col-6">
                <div className="header-left">
                  <div className="logo" style={{ minWidth: 164 }}>
                    <Link to={`/`}>{logo}</Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-11 col-md-9 col-6">
                <div className="header-right justify-content-end">
                  <nav className="mainmenunav d-lg-block">
                    <ul className="mainmenu">
                      <li className="">
                        <Link to={`/${lang}/about`}>
                          {message(data.translations, "about")}
                        </Link>
                      </li>

                      <li>
                        <Link to={`/${lang}/destinations`}>
                          {message(data.translations, "destinations")}
                        </Link>
                      </li>

                      <li>
                        <Link to={`/${lang}/schools`}>
                          {message(data.translations, "schools")}
                        </Link>
                      </li>

                      <li>
                        <Link to={`/${lang}/universities`}>
                          {message(data.translations, "universities")}
                        </Link>
                      </li>

                      <li>
                        <Link to={`/${lang}/accommodations`}>
                          {message(data.translations, "accommodations")}
                        </Link>
                      </li>

                      <li>
                        <Link to={`/${lang}/contact`}>
                          {message(data.translations, "contact")}
                        </Link>
                      </li>

                      <li>
                        <a
                          href={message(data.translations, "facebook_link") ?? data.facebook_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IconFacebook />
                        </a>
                      </li>
                      <li>
                        <a
                          href={message(data.translations, "youtube_link") ?? data.youtube_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaYoutube />
                        </a>
                      </li>
                      <li>
                        <a
                          href={message(data.translations, "instagram_link") ?? data.instagram_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IconInstagram />
                        </a>
                      </li>

                      <li style={{ alignSelf: "center", margin: 0 }}>
                        <select
                          style={{
                            border: "none",
                            fontSize: 16,
                            fontWeight: 500,
                            fontFamily: "Poppins, sans-serif",
                          }}
                          onChange={(e) => {

                            if (SUPPORTED_LANGS.includes(e.target.value)) {
                              const newPath = window.location.href.replace(`/${lang}/`, `/${e.target.value}/`)
                              return window.location.replace(newPath)
                            }

                            else {
                              window.location.replace(`https://${e.target.value}.swainternational.com`)
                            }
                          }}
                          value={lang}
                        >
                          <option value="pt">PT</option>
                          <option value="en">EN</option>
                          <option value="es">ES</option>
                          <option value="it">IT</option>
                        </select>
                      </li>
                    </ul>
                  </nav>

                  {/* Start Humberger Menu  */}
                  <div className="humberger-menu d-block d-lg-none pl--20">
                    <span
                      onClick={this.menuTrigger}
                      className="menutrigger text-white"
                    >
                      <IconMenu />
                    </span>
                  </div>
                  {/* End Humberger Menu  */}
                  <div className="close-menu d-block d-lg-none">
                    <span
                      onClick={this.CLoseMenuTrigger}
                      className="closeTrigger"
                    >
                      <IconClose />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
export default HeaderFive;