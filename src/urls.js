import { CMS_URL } from "./directus";

const assetsUrl = (id, params) => {
  if (!id) return null;
  return `${CMS_URL}/assets/${id}${params ? `?${params}` : ""}`;
};

export { assetsUrl };
