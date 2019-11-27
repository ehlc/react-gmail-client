import React, { PureComponent } from "react";
import ComposeMessage from "../../../compose-message/ComposeMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faReply } from "@fortawesome/free-solid-svg-icons";
import { getNameEmail } from "../../../../utils";
import moment from "moment";
import "./messageToolbar.scss";

export class MessageToolbar extends PureComponent {
  constructor(props) {
    super(props);
    this.trashHandler = this.getClickHandler(["TRASH"]);
  }

  getClickHandler(action) {
    return evt => {
      this.props.onClick(action);
    };
  }

  render() {
    if (!this.props.messageResult.result) {
      return null;
    }

    const message = this.props.messageResult.result;
    const { messageHeaders } = message;

    let replyTo, cc, subject;

    for (let i = 0; i < messageHeaders.length; i++) {
      const header = messageHeaders[i];
      switch (header.name) {
        case "Subject":
          subject = header;
          break;
        case "From":
          if (!replyTo) {
            replyTo = header;
          }
          break;
        case "Reply-To":
          replyTo = header;
          break;
        case "Cc":
          cc = header;
          break;
        default:
          break;
      }
    }

    if (replyTo.value === '') {
      replyTo = messageHeaders.find(e => e.name === "From");
    }

    const nameEmail = getNameEmail(replyTo.value);
    const receivedHeader = messageHeaders.find(el => el.name === "X-Received");
    const date = receivedHeader ? receivedHeader.value
          .split(";")[1]
          .trim() : "";

    let parsedDate = moment(date);

    if (!parsedDate.isValid()) {
      parsedDate = moment(
        parseInt(this.props.messageResult.result.internalDate)
      );
    }
    const replyHeader = `<p>On ${parsedDate.format("MMMM Do YYYY, h:mm:ss a")} < ${nameEmail.email} > wrote:</p>`;

    const composeProps = {
      subject: `Re: ${subject.value}`,
      to: nameEmail.email,
      content: `<p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          ${replyHeader}
          <blockquote>${this.props.messageResult.body}</blockquote>`,
      ...(cc && { cc: cc.value })
    };

    return (
      <div className="d-flex justify-content-center align-items-center message-toolbar">
        <div className="action-btns">
          <div className="action-btn mr-2">
            <button className="btn" onClick={this.trashHandler}>
              <FontAwesomeIcon
                title="Move to Trash"                
                icon={faTrash}
                size="lg"
              />
            </button>
          </div>
          <div className="action-btn mr-2">
            <ComposeMessage {...composeProps}>
              <button className="btn">
                <FontAwesomeIcon
                  title="Reply"
                  icon={faReply}
                  size="lg"
                />
              </button>
            </ComposeMessage>
          </div>
        </div>
      </div>
    );
  }
}

export default MessageToolbar;
