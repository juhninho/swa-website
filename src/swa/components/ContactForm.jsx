import React, { useState, useEffect } from "react";
import { directus } from "../../directus";
import { message } from "../../messages";
import Icon from "./Icon";

const ContactForm = ({ bgColor = "bg_color--5", subject }) => {
  const [formState, setFormState] = useState({
    rnName: "",
    rnEmail: "",
    rnSubject: subject ?? "",
    rnMessage: "",
    rnPhone: "",
    sent: false,
    error: false,
  });

  const [formData, setFormData] = useState();

  const [testimonial, setTestimonial] = useState();

  useEffect(() => {
    subject && setFormState({ ...formState, rnSubject: subject });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  useEffect(() => {
    directus
      .items("contact_form")
      .readMany({
        fields: [
          "hs_form_id",
          "hs_portal_id",
          "translations.*",
          "testimonials.author",
          "testimonials.translations.*",
        ],
      })
      .then((r) => {
        setFormData(r.data);

        const testimonialsList = r.data.testimonials;
        const testimonialChoosen =
          testimonialsList[Math.floor(Math.random() * testimonialsList.length)];

        if (testimonialChoosen) {
          setTestimonial(testimonialChoosen);
        }
      });
  }, []);

  if (!formData) return null;

  const submitToHS = (e) => {
    e.preventDefault();
    const submissionData = {
      submittedAt: new Date().getTime(),
      fields: [
        { name: "firstname", value: formState.rnName },
        { name: "message", value: formState.rnMessage },
        { name: "subject", value: formState.rnSubject },
        { name: "email", value: formState.rnEmail },
        { name: "phone", value: formState.rnPhone },
      ],
      context: {
        pageUri: window.location.href,
        pageName: document.title,
      },
    };
    fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${formData.hs_portal_id}/${formData.hs_form_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      }
    )
      .then((r) => r.json())
      .then((r) => {
        if ((r.status = "error")) {
          setFormState({ ...formState, error: true, sent: false });
        }
        setFormState({ ...formState, error: false, sent: true });
      });
  };

  const formTranslations = formData.translations;

  const testimonialComp = testimonial ? (
    <div className="col-lg-6 pb_sm--50 pb_md--30">
      <div className="rn-testimonial-content text-left">
        <div className="inner pr-md-5">
          <p>{message(testimonial.translations, "message")}</p>
          <div className="author-info">
            <h6>
              <span>{testimonial.author}</span> -{" "}
              {message(testimonial.translations, "author_country")}
            </h6>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  const formComponent = (
    <div className="col-lg-6 contact-form--1">
      <div className="section-title text-left mb--50">
        <h2 className="title color-1">{message(formTranslations, "title")}</h2>
      </div>
      {formState.sent ? (
        <div className="text-center ptb--80">
          <Icon id="check-circle" />
          <div
            className="pt--40"
            dangerouslySetInnerHTML={{
              __html: message(formTranslations, "sucess_message"),
            }}
          />
        </div>
      ) : formState.error ? (
        <div className="text-center ptb--80">
          <Icon id="frown-regular" />
          <div
            className="pt--40"
            dangerouslySetInnerHTML={{
              __html: message(formTranslations, "error_message"),
            }}
          />
        </div>
      ) : (
        <div className="form-wrapper">
          <form onSubmit={submitToHS}>
            <label htmlFor="contact-form-name">
              <input
                type="text"
                name="name"
                id="contact-form-name"
                required
                value={formState.rnName}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    rnName: e.target.value,
                  });
                }}
                placeholder={message(formTranslations, "name")}
              />
            </label>

            <label htmlFor="contact-form-email">
              <input
                type="email"
                name="email"
                id="contact-form-email"
                required
                value={formState.rnEmail}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    rnEmail: e.target.value,
                  });
                }}
                placeholder={message(formTranslations, "email")}
              />
            </label>

            <label htmlFor="contact-form-phone">
              <input
                type="text"
                name="phone"
                id="contact-form-phone"
                value={formState.rnPhone}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    rnPhone: e.target.value,
                  });
                }}
                placeholder={message(formTranslations, "phone")}
              />
            </label>

            <label htmlFor="contact-form-subject">
              <input
                type="text"
                name="subject"
                id="contact-form-subject"
                required
                value={formState.rnSubject}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    rnSubject: e.target.value,
                  });
                }}
                placeholder={message(formTranslations, "subject")}
              />
            </label>
            <label htmlFor="contact-form-message">
              <textarea
                type="text"
                id="contact-message"
                name="contact-form-message"
                required
                value={formState.rnMessage}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    rnMessage: e.target.value,
                  });
                }}
                placeholder={message(formTranslations, "message")}
              />
            </label>
            <button
              className="btn-default"
              type="submit"
              value="submit"
              name="submit"
              id="mc-embedded-subscribe"
            >
              {message(formTranslations, "send")}
            </button>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <div className={`about-area rm-about-style-2 ptb--120 ${bgColor}`}>
      <div className="row">
        <div className="col-lg-12">
          <div className="container">
            <div className="row align-items-center">
              {testimonialComp}
              {formComponent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
