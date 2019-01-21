import { getLabelList } from "../../api";
import { setSearchQuery } from "../content/message-list/actions/message-list.actions";

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

export const selectLabel = (labelId) => dispatch => {
  //dispatch(setSearchQuery(""));
  dispatch({
    type: SELECT_LABEL,
    payload: labelId
  });
};