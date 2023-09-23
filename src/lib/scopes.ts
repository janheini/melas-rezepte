import { type Provider } from "./config";

export const scopes: Record<Provider, string> = {
  github: "public_repo,user:email",
  gitlab: "api",
};
