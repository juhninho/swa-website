import React, { useState, useEffect } from "react";
import Helmet from "./components/Helmet";
import ContactForm from "./components/ContactForm";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FaRegClock } from "react-icons/fa";
import Pagination from "./components/Pagination";
import { directus } from "../directus";
import { altText, message, siteLanguage } from "../messages";
import { assetsUrl } from "../urls";
import Link from "./components/Link";
import HighlightedPosts from "./components/HighlightedPosts";

import TimeAgo from "react-timeago";
import ptStrings from "react-timeago/lib/language-strings/pt-br.js";
import enStrings from "react-timeago/lib/language-strings/en.js";
import esStrings from "react-timeago/lib/language-strings/es.js";
import itStrings from "react-timeago/lib/language-strings/it.js";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

const POSTS_PER_PAGE = 10;

const FORMATTERS = {
  "pt-BR": ptStrings,
  "en-US": enStrings,
  "it-IT": itStrings,
  "es-ES": esStrings,
};

const Post = ({ post }) => {
  const formatter = buildFormatter(FORMATTERS[siteLanguage]);

  return (
    <div className="service service__style--2 text-center bg-gray p-0 blog-item">
      <Link to={`/blog/${post.id}`}>
        <div className="row col-12" style={{ paddingLeft: 0 }}>
          <div className="col-3 post-img">
            <img
              src={assetsUrl(post.bgimage?.id)}
              alt={altText(post.bgimage?.description)}
              loading="lazy"
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
              }}
            />
          </div>
          <div className="content col-md-9 col-sm-12 text-left post-info">
            <h3 className="title">{post.title}</h3>
            <p
              className="post-description rich-text-content"
              dangerouslySetInnerHTML={{ __html: post.summary }}
            />

            <p>
              <FaRegClock />
              <span className="pl--20 font--15">
                <TimeAgo date={post.date_created} formatter={formatter} />
              </span>
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

const PostsByCategory = ({ categoryId, emptyText }) => {
  const [categoryPosts, setCategoryPosts] = useState();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    directus
      .items("blog_post")
      .readMany({
        filter: {
          _and: [
            { language: { _eq: siteLanguage } },
            { category: { _eq: categoryId } },
          ],
        },
        fields: [
          "author",
          "date_created",
          "summary",
          "title",
          "bgimage.id",
          "bgimage.description",
          "id",
        ],
        meta: ["filter_count"],
        sort: "-date_created",
        limit: POSTS_PER_PAGE,
        offset: page * POSTS_PER_PAGE,
      })
      .then((r) => {
        setCategoryPosts(r.data);
        setTotal(r.meta.filter_count);
      });
  }, [categoryId, page]);

  if (categoryPosts === undefined) return null;

  if (total === 0) return <div className="pt--80">{emptyText}</div>;

  return (
    <div className="container">
      <div className="service-main-wrapper column">
        {categoryPosts.map((p) => (
          <Post post={p} key={p.id} />
        ))}
      </div>

      <div className="pt--60">
        <Pagination
          page={page}
          itemsPerPage={POSTS_PER_PAGE}
          total={total}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

const Blog = () => {
  const [selectTab, setSelectedTab] = useState(0);
  const [pageData, setPageData] = useState();
  const [categories, setCategories] = useState();

  useEffect(() => {
    directus
      .items("blog_page")
      .readMany({
        fields: [
          "bgimage.id",
          "bgimage.description",
          "translations.languages_code",
          "translations.page_title",
          "translations.page_description",
          "translations.header",
          "translations.subheader",
          "translations.featured_text",
          "translations.no_posts",
        ],
      })
      .then((r) => setPageData(r.data));

    directus
      .items("category_translations")
      .readMany({ filter: { languages_code: { _eq: siteLanguage } } })
      .then((r) => setCategories(r.data));
  }, []);

  if (!pageData) return null;

  const translations = pageData.translations;

  return (
    <>
      <Helmet
        title={message(translations, "page_title")}
        description={message(translations, "page_description")}
      />
      <div
        className="rn-page-title-area pt--120 pb--190 bg_image bg_image--15"
        data-black-overlay="3"
      >
        <img
          src={assetsUrl(pageData.bgimage?.id)}
          loading="lazy"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            objectFit: "cover",
            zIndex: -2,
          }}
          alt={altText(pageData.bgimage?.description)}
        />
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="rn-page-title text-center pt--100">
                <h2 className="title text-white">
                  {message(translations, "header")}
                </h2>
                <p className="description">
                  {message(translations, "subheader")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HighlightedPosts title={message(translations, "featured_text")} />

      {categories && categories.length ? (
        <div className="designer-portfolio-area ptb--120 bg_color--1">
          <div className="wrapper plr--70 plr_sm--30 plr_md--30">
            <Tabs selectedIndex={selectTab} onSelect={setSelectedTab}>
              <div className="row text-center">
                <div className="col-lg-12">
                  <div className="tablist-inner">
                    <TabList className="pv-tab-button text-center mt--0 justify-content-center">
                      {categories.map((c, i) => (
                        <Tab key={i}>
                          <span>{c.name}</span>
                        </Tab>
                      ))}
                    </TabList>
                  </div>
                  {categories.map((c, i) => (
                    <TabPanel key={i}>
                      <PostsByCategory
                        categoryId={c.category_id}
                        emptyText={message(translations, "no_posts")?.replace(
                          "$CATEGORY",
                          c.name
                        )}
                      />
                    </TabPanel>
                  ))}
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      ) : null}

      <ContactForm />
    </>
  );
};

export default Blog;
