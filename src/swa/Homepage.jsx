import React, { Component, Fragment } from "react";
import { FiChevronsRight } from "react-icons/fi";
import ModalVideo from "react-modal-video";
import { directus } from "../directus";
import { altText, message } from "../messages";
import { assetsUrl } from "../urls";
import ContactForm from "./components/ContactForm";
import FeaturedOffers from "./components/FeaturedOffers";
import Helmet from "./components/Helmet";
import HighlightedPosts from "./components/HighlightedPosts";
import Link from "./components/Link";
import Loading from "./components/Loading";
import MainCarousel from "./components/MainCarousel";

class Homepage extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      data: null,
    };
    this.openModal = this.openModal.bind(this);
  }

  componentDidMount() {
    directus
      .items("homepage")
      .readMany({
        fields: [
          "translations.*",
          "translations.consulting_bgimage.id",
          "translations.consulting_bgimage.description",
          "translations.board_speech_video_thumb.id",
          "translations.board_speech_video_thumb.description",
        ],
      })
      .then((r) => {
        this.setState({ data: r.data });
      });
  }

  openModal() {
    this.setState({ isOpen: true });
  }

  render() {
    if (!this.state.data) return <Loading />;

    const translations = this.state.data.translations;

    return (
      <Fragment>
        <Helmet
          title={message(translations, "page_title")}
          description={message(translations, "page_description")}
        />

        <MainCarousel />

        <HighlightedPosts
          title={message(translations, "blog_title")}
          blogLinkText={message(translations, "blog_link_text")}
        />

        <div className="container">
          <div className="service-area ptb--120 bg_color--1">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title text-center mb--30">
                  <div className="font-weight-bold text-color-primary mb--20">
                    {message(translations, "offers_headline")}
                  </div>
                  <h2 className="title color-1">
                    {message(translations, "offers_title")}
                  </h2>
                  <p className="description">
                    {message(translations, "offers_subheader")}
                  </p>
                </div>
              </div>
            </div>

            <div className="container">
              <FeaturedOffers
                cardButtonText={message(
                  translations,
                  "offers_card_button_text"
                )}
              />

              <div className="pt--80 text-center">
                <Link
                  className="button btn-default btn-border text-uppercase"
                  to="/offers"
                >
                  <FiChevronsRight />
                  <span className="pl-2">
                    {message(translations, "offers_see_more_link")}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="rn-finding-us-area rn-finding-us ptb--120 bg_color--1 bg_image"
          data-black-overlay="5"
        >
          <img
            src={assetsUrl(message(translations, "consulting_bgimage")?.id)}
            loading="lazy"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              objectFit: "cover",
              zIndex: -2,
            }}
            alt={altText(
              message(translations, "consulting_bgimage")?.description
            )}
          />
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className="inner">
                  <div className="content-wrapper">
                    <div className="content">
                      <div className="font-weight-bold text-color-primary mb--10">
                        {message(translations, "consulting_headline")}
                      </div>
                      <h4 className="font-weight-bold text-color-primary">
                        {message(translations, "consulting_header")}
                      </h4>
                      <p
                        className="description rich-text-content"
                        dangerouslySetInnerHTML={{
                          __html: message(translations, "consulting_text"),
                        }}
                      ></p>
                      <Link className="btn-default text-center" to="/contact">
                        {message(translations, "consulting_button_text")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rn-service-details ptb--120">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="service-details-inner">
                  <div className="inner">
                    <div className="row row--35 sercice-details-content align-items-center">
                      <div className="col-lg-6 col-12">
                        <div className="thumb position-relative">
                          <img
                            className="w-100 h-100"
                            src={assetsUrl(
                              message(translations, "board_speech_video_thumb")
                                ?.id
                            )}
                            alt={altText(
                              message(translations, "board_speech_video_thumb")
                                ?.description
                            )}
                            loading="lazy"
                            height={800}
                            width={800}
                            style={{ filter: "contrast(0.5)" }}
                          />
                          <ModalVideo
                            channel="youtube"
                            isOpen={this.state.isOpen}
                            videoId={message(
                              translations,
                              "board_speech_video_id"
                            )}
                            onClose={() => this.setState({ isOpen: false })}
                            autoplay
                          />
                          <button
                            className="video-popup"
                            onClick={this.openModal}
                          >
                            <span className="play-icon"></span>
                          </button>
                        </div>
                      </div>
                      <div className="col-lg-6 col-12">
                        <div className="details mt_md--30 mt_sm--30">
                          <div className="section-title">
                            <span className="subtitle text-color-primary">
                              {message(translations, "board_speech_healdine")}
                            </span>
                            <h2 className="title color-1">
                              {message(translations, "board_speech_title")}
                            </h2>
                            <p
                              className="description rich-text-content"
                              dangerouslySetInnerHTML={{
                                __html: message(
                                  translations,
                                  "board_speech_text"
                                ),
                              }}
                            />
                            <div className="purchase-btn">
                              <div className="btn-transparent mt--30 text-uppercase">
                                {message(translations, "board_speech_ceo_name")}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </Fragment>
    );
  }
}
export default Homepage;
