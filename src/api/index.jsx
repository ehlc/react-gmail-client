import { MAX_RESULTS } from "../constants";
import {getBody, isHTML} from './utils';

const getLabelDetailPromise = labelId => {
  return new Promise((resolve, reject) => {
    window.gapi.client.gmail.users.labels
      .get({
        userId: "me",
        id: labelId
      })
      .then(response => resolve(response));
  });
};

const getLabelDetails = labelList => {
  return new Promise((resolve, reject) => {
    const labelPromises = labelList.result.labels.map(el => {
      return getLabelDetailPromise(el.id);
    });

    Promise.all(labelPromises).then(response => resolve(response));
  });
};

export const getLabelList = () =>
  new Promise((resolve, reject) => {
    window.gapi.client.gmail.users.labels
      .list({
        userId: "me"
      })
      .then(getLabelDetails)
      .then(response => {
        resolve(response.map(el => el.result));
      });
  });

export const getMessageList = ({ labelIds, maxResults, pageToken }) =>
  new Promise((resolve, reject) => {
    getMessageRawList({ labelIds, maxResults, pageToken })
      .then(getMessageHeaders)
      .then(messageResult =>
        flattenMessagesWithLabel(messageResult.messages, labelIds).then(
          labelMessagesDetails => resolve({
            ...messageResult,
            messages: labelMessagesDetails.messages,
            label: labelMessagesDetails.label
          })
        )
      )
      .catch(err => {
        reject(err);
      });
  });

export const flattenMessagesWithLabel = (messages, labelIds) =>
  new Promise((resolve, reject) => {
    window.gapi.client.gmail.users.labels
      .get({
        userId: "me",
        id: labelIds[0]
      })
      .then(response =>
        resolve({
          messages,
          label: response
        })
      );
  });

const getMessageRawList = ({ labelIds, maxResults, pageToken, q = "" }) =>
  new Promise((resolve, reject) => {
    window.gapi.client.gmail.users.messages
      .list({
        userId: "me",
        q,
        maxResults: maxResults || MAX_RESULTS,
        labelIds: labelIds,
        ...(pageToken && { pageToken })
      })
      .then(response => resolve(response))
      .catch(err => {
        reject(err);
      });
  });

const getMessageHeaders = response => {
  const messageResult = response.result;

  return new Promise((resolve, reject) => {
    const headerPromises = (messageResult.messages || []).map(el => {
      return getMessageHeader(el.id);
    });

    Promise.all(headerPromises).then(messages =>
      resolve({
        ...messageResult,
        messages
      })
    );
  });
};

const getMessageHeader = id => {
  return new Promise((resolve, reject) => {
    window.gapi.client.gmail.users.messages
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
      })
      .then(response => resolve(response.result));
  });
};


export const getMessage = messageId => {
  return new Promise((resolve, reject) => {
    window.gapi.client.gmail.users.messages
      .get({
        userId: "me",
        id: messageId,
        format: "full"
      })
      .then(response => {
        const { result } = response;

        let body = getBody(result.payload, "text/html");        

        if (body === "") {
          body = getBody(result.payload, "text/plain");
          body = body.replace(/(\r\n)+/g, '<br data-break="rn-1">').replace(/[\n\r]+/g, '<br data-break="nr">');
        }

        if (body !== "" && !isHTML(body)) {
          body = body.replace(/(\r\n)+/g, '<div data-break="rn-1" style="margin-bottom:10px"></div>').replace(/[\n\r]+/g, '<br data-break="nr">');
        }
          
        resolve({
          body,
          headers: response.headers,
          result: { ...result, messageHeaders: response.result.payload.headers, payload: undefined }
        });
      })
      .catch(error => {
        reject(error);
      });
  });
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

export const batchModify = ({ids, addLabelIds = [], removeLabelIds = []}) => new Promise((resolve, reject) => {
  window.gapi.client.gmail.users.messages
    .batchModify({
      userId: "me",
      ids,
      addLabelIds,
      removeLabelIds
    })
    .then(response =>
      {
        resolve(ids)
      }
    );
});
