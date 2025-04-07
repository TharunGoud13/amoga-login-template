import DOMPurify from "dompurify";
import parse from "html-react-parser";

function decodeHtmlEntities(html: string) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export const renderSafeHtml = (html: string) => {
  console.log("html-----", html);
  if (typeof window === undefined) return null;

  const decodedHtml = decodeHtmlEntities(html);
  console.log("decodedHtml-----", decodedHtml);
  const cleanHtml = DOMPurify.sanitize(decodedHtml, {
    USE_PROFILES: { html: true },
  });
  console.log("cleanHtml-----", cleanHtml);
  console.log("parse-----", parse(cleanHtml));
  return parse(cleanHtml);
};
