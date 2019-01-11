import React, { PureComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import './listToolbar.scss';

export class ListActionButtons extends PureComponent {
  constructor(props) {
    super(props);
    this.getClickHandler = this.getClickHandler.bind(this);
    this.trashHandler = this.getClickHandler(["TRASH"]);
  }

  getClickHandler(action) {
    return evt => {
      this.props.onClick(action);
    };
  }

  render() {
    return (
      <div>
        <div className="action-btn">
          <FontAwesomeIcon
            title="Move to Trash"
            onClick={this.trashHandler}
            icon={faTrash}
            size="lg"
          />
        </div>
      </div>
    );
  }
}

export default ListActionButtons;
