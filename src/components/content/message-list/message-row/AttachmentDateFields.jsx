import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

export default (props) => {
  return (
    <div className="wrapper num-4">
      <div className="wrapper num-2">
        <div className="num pr-4">
          {props.hasAttachment ? (
            <FontAwesomeIcon icon={faPaperclip} />
          ) : (
            ""
          )}
        </div>
        <div className="num pr-4">{props.formattedDate}</div>
      </div>
    </div>
  );
};
