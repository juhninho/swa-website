import React, { useState, useEffect } from "react";
import ModalVideo from "react-modal-video";
import { VideoTag } from "react-video-tag";
import Helmet from "./components/Helmet";
import Crew from "./components/Crew";
import ContactForm from "./components/ContactForm";
import { directus } from "../directus";
import { altText, message } from "../messages";
import { assetsUrl } from "../urls";
import Banner from "./components/Banner";
import Loading from "./components/Loading";

const About = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    directus
      .items("about")
      .readMany({
        fields: [
          "background_video",
          "translations.*",
          "translations.banner_bgimage.id",
          "translations.banner_bgimage.description",
          "translations.video_thumb.id",
          "translations.video_thumb.description",
          "crew.*",
          "crew.image.id",
          "crew.image.description",
          "crew.translations.*",
        ],
      })
      .then((r) => setData(r.data));
  }, []);

  if (!data) return <Loading />;

  const translations = data.translations;

  return (
    <>
      <Helmet
        title={message(translations, "page_title")}
        description={message(translations, "page_description")}
      />

      <div className="slider-wrapper">
        <div
          className="slide slide-style-2 slider-video-bg d-flex align-items-center justify-content-center"
          data-black-overlay="6"
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12">
                <div className="inner text-center pt--0">
                  <h1 className="title mt--20">
                    {message(translations, "title")}
                  </h1>

                  <p className="description">
                    {message(translations, "subtitle")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="video-background">
            <VideoTag
              autoPlay
              muted
              playsInline
              loop
              src={assetsUrl(data.background_video)}
            />
          </div>
        </div>

        <div className="video-image-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className="thumb position-relative">
                  <img
                    loading="lazy"
                    className="w-100"
                    src={assetsUrl(message(translations, "video_thumb")?.id)}
                    alt={altText(
                      message(translations, "video_thumb")?.description
                    )}
                    style={{ filter: "brightness(0.8)" }}
                  />
                  <ModalVideo
                    channel="youtube"
                    isOpen={isOpen}
                    videoId={message(translations, "video_id")}
                    onClose={() => setIsOpen(false)}
                    autoplay
                  />
                  <button
                    className="video-popup position-top-center theme-color"
                    onClick={() => setIsOpen(true)}
                  >
                    <span className="play-icon"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-12">
        <div
          className="ptb--80 container rich-text-content"
          dangerouslySetInnerHTML={{
            __html: message(translations, "content_text"),
          }}
        />
      </div>

      {message(translations, "banner_title") ? (
        <Banner
          title={message(translations, "banner_title")}
          subtitle={message(translations, "banner_subtitle")}
          button={{
            icon: message(translations, "banner_button_icon"),
            link: message(translations, "banner_button_link"),
            text: message(translations, "banner_button_text"),
          }}
          bgImage={message(translations, "banner_bgimage")}
        />
      ) : null}


      <div className="rn-team-wrapper ptb--120 bg_color--1">
        <div className="rn-team-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title text-center mb--30">
                  <span className="subtitle">
                    {message(translations, "crew_heading")}
                  </span>
                  <h2 className="title">
                    {message(translations, "crew_title")}
                  </h2>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <p
                      className="description"
                      style={{ maxWidth: "50%" }}
                      dangerouslySetInnerHTML={{
                        __html: message(translations, "crew_subtitle"),
                      }}
                    ></p>
                  </div>
                </div>
              </div>
            </div>
            <Crew crew={data.crew} />
          </div>
        </div>
      </div>

      <ContactForm formPosition="left" />
    </>
  );
};

export default About;
