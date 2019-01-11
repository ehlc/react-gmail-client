import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";

export default (props) => {
  return (
    <div className="btn-group ml-auto">
      <button
        onClick={props.navigateToPrevPage}
        disabled={props.prevToken == null}
        className="btn btn-light bg-white border-1 border-dark px-3 btn-sm"
        title="Previous Page"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        onClick={props.navigateToNextPage}
        disabled={props.nextToken == null}
        className="btn btn-light bg-white border-1  border-dark px-3 btn-sm"
        title="Next Page"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}