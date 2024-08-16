import React, { useState, useEffect } from "react";
import Helmet from "./components/Helmet";
import ContactForm from "./components/ContactForm";
import { Redirect, useParams } from "react-router-dom";
import { FaClock, FaUser } from "react-icons/fa";
import { directus } from "../directus";
import { assetsUrl } from "../urls";
import Banner from "./components/Banner";
import { altText, siteLanguage } from "../messages";
import Loading from "./components/Loading";

const BlogPost = () => {
  const { postid } = useParams();

  const [post, setPost] = useState();
  const [bannerData, setBannerData] = useState();

  useEffect(() => {
    directus
      .items("blog_post")
      .readOne(postid, {
        fields: [
          "author",
          "date_created",
          "page_title",
          "page_description",
          "title",
          "language",
          "subtitle",
          "content",
          "bgimage.id",
          "bgimage.description",
          "banner_title",
          "banner_subtitle",
          "banner_button",
          "banner_bgimage.id",
          "banner_bgimage.description",
          "banner_button_icon",
          "banner_button_link",
        ],
      })
      .then(
        (r) => {
          setPost(r);

          if (r.banner_title) {
            setBannerData(r);
          }
        },
        () => window.location.replace("/404")
      );
  }, []);

  useEffect(() => {
    if (post && post.banner_title) return;

    directus
      .items("blog_page_translations")
      .readMany({
        filter: { languages_code: { _eq: siteLanguage } },
        fields: [
          "banner_title",
          "banner_subtitle",
          "banner_bgimage.id",
          "banner_bgimage.description",
          "banner_button_link",
          "banner_button_icon",
          "banner_button",
        ],
      })
      .then((r) => {
        setBannerData(r.data[0]);
      });
  }, [post]);

  if (!post) return <Loading />;

  if (post.language !== siteLanguage) return <Redirect to="/blog" />;

  return (
    <>
      <Helmet title={post.page_title} description={post.page_description} />
      <div
        className="rn-page-title-area pt--120 pb--190 bg_image bg_image--15"
        data-black-overlay="3"
      >
        <img
          src={assetsUrl(post.bgimage?.id)}
          loading="lazy"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            objectFit: "cover",
            zIndex: -2,
          }}
          alt={altText(post.bgimage?.description)}
        />
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="rn-page-title blog-single-page-title text-center pt--100">
                <h2 className="title text-white">{post.title}</h2>
                <p className="description">{post.subtitle}</p>
                <ul className="blog-meta d-flex justify-content-center align-items-center">
                  <li>
                    <FaClock />
                    {new Date(post.date_created).toLocaleDateString(
                      siteLanguage
                    )}
                  </li>
                  <li>
                    <FaUser />
                    {post.author}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div
          className="ptb--120 rich-text-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {bannerData && (
        <Banner
          bgImage={bannerData.banner_bgimage}
          button={{
            link: bannerData.banner_button_link,
            icon: bannerData.banner_button_icon,
            text: bannerData.banner_button,
          }}
          title={bannerData.banner_title}
          subtitle={bannerData.banner_subtitle}
        />
      )}

      <ContactForm />
    </>
  );
};

export default BlogPost;
