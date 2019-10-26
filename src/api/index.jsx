import { MAX_RESULTS } from "../constants";
import {getBody, isHTML} from './utils';

const getLabelDetailPromise = async (labelId) => {
  return await window.gapi.client.gmail.users.labels.get({
      userId: "me",
      id: labelId
    });
};

const getLabelDetails = async (labelList) => {
  const labelPromises = labelList.result.labels.map(async (el) => {
    return await getLabelDetailPromise(el.id);
  });

  return Promise.all(labelPromises);
};

export const getLabelList = async () => {
  const labelIds = await window.gapi.client.gmail.users.labels.list({userId: "me"});
  const labelDetails = await getLabelDetails(labelIds);
  return labelDetails.map(el => el.result);
}

export const getMessageList = async ({ labelIds, maxResults, q, pageToken }) => {
  const rawList = await getMessageRawList({ labelIds, maxResults, pageToken, q });
  const messageHeaders = await getMessageHeaders(rawList);
  const flattenedMessages = await flattenMessagesWithLabel(messageHeaders.messages, labelIds);
  return {
    ...messageHeaders,
    messages: flattenedMessages.messages,
    label: flattenedMessages.label
  };
}

export const flattenMessagesWithLabel = async (messages, labelIds) => {
  if (!labelIds) {
    return {
      messages,
      label: {
        result: {
          messagesTotal: 0
        }
      }
    };
  }

  const labels = await window.gapi.client.gmail.users.labels.get({userId: "me", id: labelIds[0]});
  
  return {
    messages,
    label: labels
  };
}

const getMessageRawList = async ({ labelIds, maxResults, pageToken, q = "" }) => {
  return await window.gapi.client.gmail.users.messages
    .list({
      userId: "me",
      q,
      maxResults: maxResults || MAX_RESULTS,
      ...(labelIds && {labelIds}),
      ...(pageToken && { pageToken })
    });
}
 
const getMessageHeaders = async (messageRawList) => {
  const messageResult = messageRawList.result;

  const headerPromises = (messageResult.messages || []).map(async (el) => {
    return await getMessageHeader(el.id);
  });

  const messages = await Promise.all(headerPromises);

  return {
    ...messageResult,
    messages
  };  
};

const getMessageHeader = async (id) => {
    const messages = await window.gapi.client.gmail.users.messages
      .get({
        userId: "me",
        id: id,
        format: "metadata",
        metadataHeaders: [
          "Delivered-To",
          "X-Received",
          "To",
          "Message-ID",
          "Date",
          "Content-Type",
          "MIME-Version",
          "Reply-To",
          "From",
          "Subject",
          "Return-Path",
          // See https://www.iana.org/assignments/message-headers/message-headers.xhtml
          // for more headers
        ]
      });
      return messages.result;
};

export const getMessage = async(messageId) => {  
  const response = await window.gapi.client.gmail.users.messages
  .get({
    userId: "me",
    id: messageId,
    format: "full"
  });

  const { result } = response;

  let body = getBody(result.payload, "text/html");        

  if (body === "") {
    body = getBody(result.payload, "text/plain");
    body = body.replace(/(\r\n)+/g, '<br data-break="rn-1">').replace(/[\n\r]+/g, '<br data-break="nr">');
  }

  if (body !== "" && !isHTML(body)) {
    body = body.replace(/(\r\n)+/g, '<div data-break="rn-1" style="margin-bottom:10px"></div>').replace(/[\n\r]+/g, '<br data-break="nr">');
  }
    
  return {
    body,
    headers: response.headers,
    result: { ...result, messageHeaders: response.result.payload.headers, payload: undefined }
  };
};

export const sendMessage = ({ headers, body }) => {
  let email = "";

  const headersClone = { ...headers };
  headersClone["Content-Type"] = "text/html; charset='UTF-8'";
  headersClone["Content-Transfer-Encoding"] = "base64";

  for (let header in headersClone) {
    email += `${header}: ${headersClone[header]}\r\n`;
  }

  email += `\r\n<html><body>${body}</body></html>`;
  const encodedEmail = unescape(encodeURIComponent(email));

  return window.gapi.client.gmail.users.messages.send({
    userId: "me",
    resource: {
      raw: window.btoa(encodedEmail).replace(/\+/g, "-").replace(/\//g, "_")
    }
  });
};

export const batchModify = async ({ids, addLabelIds = [], removeLabelIds = []}) => {
  const batchModifyResult = await window.gapi.client.gmail.users.messages
    .batchModify({
      userId: "me",
      ids,
      addLabelIds,
      removeLabelIds
    });

    return ids;
}
