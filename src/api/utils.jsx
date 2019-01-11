

export const getBody = (message, mimeType) => {
  let encodedBody = "";
  if (typeof message.parts === "undefined") {
    encodedBody = message.body.data;
  } else {
    encodedBody = getHTMLPart(message.parts, mimeType);
  }
  encodedBody = encodedBody
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .replace(/\s/g, "");
  return decodeURIComponent(escape(window.atob(encodedBody)));
};

const getHTMLPart = (arr, mimeType) => {
  for (let x = 0; x < arr.length; x++) {
    if (typeof arr[x].parts === "undefined") {
      if (arr[x].mimeType === mimeType) {
        return arr[x].body.data;
      }
    } else {
      return getHTMLPart(arr[x].parts, mimeType);
    }
  }
  return "";
};

export const isHTML = str => {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
}