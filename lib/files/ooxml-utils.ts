import { unzipSync } from "fflate";

export function unzipOfficeDocument(bytes: Uint8Array): Record<string, Uint8Array> {
  return unzipSync(bytes);
}

export function decodeXml(bytes: Uint8Array): string {
  return new TextDecoder("utf-8").decode(bytes);
}

export function decodeEntities(value: string): string {
  return value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&").replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)));
}

export function extractXmlText(xml: string, tag: string): string[] {
  const pattern = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "g");
  return [...xml.matchAll(pattern)].map(match => decodeEntities(match[1].replace(/<[^>]+>/g, "")).trim()).filter(Boolean);
}
