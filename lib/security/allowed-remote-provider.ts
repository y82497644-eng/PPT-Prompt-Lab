export interface AllowedRemoteProvider { readonly id: string; readonly allowedHosts: readonly string[]; }
export const allowedRemoteProviders: AllowedRemoteProvider[] = [{ id: "openai-web-search", allowedHosts: ["api.openai.com"] }];

export function assertAllowedRemoteUrl(url: URL) {
  if (!allowedRemoteProviders.some(provider => provider.allowedHosts.includes(url.hostname))) throw new Error("Remote provider is not approved");
}
