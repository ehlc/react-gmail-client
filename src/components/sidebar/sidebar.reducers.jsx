import { GET_LABELS, SELECT_LABEL } from "./sidebar.actions";

const defaultLabelState = {
    labels: []
}

export const labelsResult = (state = defaultLabelState, action) => {
  switch (action.type) {
    case GET_LABELS:
    console.log(action.payload);
      return {
        ...state,
        labels: action.payload
      };
    case SELECT_LABEL:
      return {
        ...state, 
        labels: state.labels.map(el => {
          if (el.id === action.payload) {
            return {
              ...el, 
              selected: true
            }
          }
          return {
            ...el, 
            selected: false
          };
        })
      };
    default:
      return state;
  }
};
