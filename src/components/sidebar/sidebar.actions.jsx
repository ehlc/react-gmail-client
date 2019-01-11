import { getLabelList } from "../../api";

export const GET_LABELS = "GET_LABELS";
export const SELECT_LABEL = "SELECT_LABEL";


export const getLabels = () => dispatch => {
  getLabelList().then(labelList => {
    dispatch({
      type: GET_LABELS,
      payload: labelList
    });
  });
};

export const selectLabel = (labelId) => ({
  type: SELECT_LABEL,
  payload: labelId
});

// export const getLabelList = () => dispatch =>
//   new Promise((resolve, reject) => {
//     window.gapi.client.gmail.users.labels
//       .list({
//         userId: "me"
//       })
//       .then(response => {
//         dispatch({
//           type: GET_LABELS,
//           payload: response.result.labels
//         });
//         resolve(response.result.labels);
//       });
//   });
