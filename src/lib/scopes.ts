import { type Provider } from "./config";

export const scopes: Record<Provider, string> = {
  github: "public_repo,user",
  gitlab: "api",
};
