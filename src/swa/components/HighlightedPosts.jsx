import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { directus } from "../../directus";
import Link from "./Link";
import { assetsUrl } from "../../urls";
import { altText, message, siteLanguage } from "../../messages";
import { FiChevronsRight } from "react-icons/fi";

const slickDot = {
  infinite: false,
  slidesToShow: 3,
  slidesToScroll: 3,
  dots: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 993,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 580,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 481,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const HighlightedPosts = ({ title, blogLinkText }) => {
  const [posts, setPosts] = useState();
  const [buttonTexts, setButtonTexts] = useState();

  useEffect(() => {
    directus
      .items("blog_post")
      .readMany({
        filter: {
          _and: [{ featured: { _eq: true } }, { language: { _eq: siteLanguage } }],
        },
        fields: [
          "id",
          "bgimage.id",
          "bgimage.description",
          "title",
          "category.translations.name",
          "category.translations.languages_code",
        ],
        sort: "-date_created",
      })
      .then((r) => setPosts(r.data));

    directus
      .items("blog_page_translations")
      .readMany({
        filter: { languages_code: { _eq: siteLanguage } },
        fields: ["read_more_text"],
      })
      .then((r) => {
        setButtonTexts(r.data?.[0]);
      });
  }, []);

  if (!buttonTexts || !posts || !posts.length) return null;

  return (
    <div className="rn-blog-area pt--60 pb--60 bg_color--5" id="blog">
      <div className="container">
        {title && (
          <h2 className="color-1" style={{ fontWeight: 600 }}>
            {title}
          </h2>
        )}
        <div className="row mt--10 rn-slick-dot slick-space-gutter--15 slickdot--20 row--0">
          <div className="col-lg-12">
            <Slider {...slickDot}>
              {posts.map((post, i) => (
                <div className="im_box" key={"post-list" + i}>
                  <div className="thumbnail">
                    <Link to={`/blog/${post.id}`}>
                      <img
                        className="w-100"
                        src={assetsUrl(post.bgimage?.id)}
                        alt={altText(post.bgimage?.description)}
                        loading="lazy"
                        height={532}
                        width={390}
                        style={{ objectFit: "cover" }}
                      />
                    </Link>
                  </div>
                  <div className="content">
                    <div className="inner">
                      <div className="content_heading">
                        <div className="category_list">
                          <Link to={`/blog/${post.id}`}>
                            {message(post.category.translations, "name")}
                          </Link>
                        </div>
                        <h4 className="title">
                          <Link to={`/blog/${post.id}`}>{post.title}</Link>
                        </h4>
                      </div>
                      <div className="content_footer">
                        <Link
                          to={`/blog/${post.id}`}
                          className="rn-btn btn-opacity"
                        >
                          {buttonTexts?.read_more_text}
                        </Link>
                      </div>
                    </div>
                    <Link
                      className="transparent_link"
                      to={`/blog/${post.id}`}
                    ></Link>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        {blogLinkText ? (
          <div className="text-center pt--80">
            <Link className="btn-default text-uppercase btn-border" to="/blog">
              <FiChevronsRight />
              <span className="pl-2">{blogLinkText}</span>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HighlightedPosts;
