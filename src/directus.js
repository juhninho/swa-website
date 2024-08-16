import { Directus } from "@directus/sdk";

export const CMS_URL = "https://cms.swainternational.com";

const directus = new Directus(CMS_URL);

export { directus };
