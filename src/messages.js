const LANG_MAP = {
  pt: "pt-BR",
  en: "en-US",
  it: "it-IT",
  es: "es-ES",
};

let siteLanguage = LANG_MAP[window.location.pathname.split("/")[1]];

const updateSiteLanguage = () =>
  (siteLanguage = LANG_MAP[window.location.pathname.split("/")[1]]);

const message = (translations, id, lang = siteLanguage) => {
  return translations?.find((t) => t.languages_code === lang)?.[id];
};

const altText = (description, lang = "pt-BR") =>
  description
    ?.split("\n")
    ?.find((alt) => alt.startsWith(lang))
    ?.split(":")[1]
    ?.trim() ?? "image";

const getLangId = () =>
  Object.entries(LANG_MAP).find(([k, v]) => v === siteLanguage)[0];

export { message, altText, siteLanguage, getLangId, updateSiteLanguage };
