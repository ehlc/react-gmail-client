import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export default () => {
  return (
    <div className="d-flex w-100 h-100 flex-column justify-content-center align-items-center">
    <div>
      <FontAwesomeIcon icon={faExclamationTriangle} size="5x" />
    </div>
      <div className="h1">404 ERROR</div>
      <div>The requested content was not found.</div>
    </div>
  );
};
