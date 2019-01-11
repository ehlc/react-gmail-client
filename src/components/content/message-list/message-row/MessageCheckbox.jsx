import React from "react";
import Checkbox from "../../../common/Checkbox";

export default props => {
  return (
    <div className="d-flex ml-2 justify-content-center align-items-center">
      <Checkbox checked={props.selected} onChange={props.onChange} />
    </div>
  );
};
