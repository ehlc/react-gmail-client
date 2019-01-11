import React, { PureComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class LabelItem extends PureComponent {

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);

  }

  onClick(evt) {
    this.props.onClick(evt, this.props.id);
  }

  render() {
    const {name, messagesUnread} = this.props;
    const iconProps = this.props.iconProps;

    let selected = this.props.selected ? " selected" : "";

    const messagesUnreadLocale = messagesUnread.toLocaleString();
    return (
      <li
        className={`text-truncate text-left text-dark pl-4 pr-5 py-2 border-0 ${selected}`}
        title={
          name + (messagesUnread > 0 ? ` (${messagesUnreadLocale})` : "")
        }
        onClick={this.onClick}
      >
        <FontAwesomeIcon size="sm" {...iconProps} />
        {name}

        {messagesUnread > 0 ? (
          <div className={"msg-count"}>{messagesUnreadLocale}</div>
        ) : null}
      </li>
    );
  }
}

export default LabelItem;
