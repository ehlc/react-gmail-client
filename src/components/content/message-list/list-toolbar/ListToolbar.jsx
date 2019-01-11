import React, { PureComponent } from "react";
import Checkbox from "../../../common/Checkbox";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  toggleSelected,
  modifyMessages
} from "../actions/message-list.actions";
import Pager from "../pager-buttons/PagerButtons";
import ListActionButtons from "./ListActionButtons";

export class MessageToolbar extends PureComponent {
  constructor(props) {
    super(props);

    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.navigateToNextPage = this.navigateToNextPage.bind(this);
    this.navigateToPrevPage = this.navigateToPrevPage.bind(this);
    this.modifyMessages = this.modifyMessages.bind(this);

    this.state = {
      selectedMessageIds: []
    };
  }

  onSelectionChange(evt) {
    const checked = evt.target.checked;

    const messageIds = this.props.messagesResult.messages.reduce((acc, el) => {
      acc.push(el.id);
      return acc;
    }, []);

    this.setState({
      selectedMessageIds: messageIds
    });

    this.props.toggleSelected(messageIds, checked);
  }

  navigateToNextPage() {
    this.props.navigateToNextPage(this.props.nextToken);
  }

  navigateToPrevPage() {
    this.props.navigateToPrevPage(this.props.prevToken);
  }

  modifyMessages(addLabelIds, removeLabelIds) {
    const ids = this.props.messagesResult.messages.filter(el => el.selected).map(el => el.id);
    const actionParams = {
      ...addLabelIds && {addLabelIds},
      ...removeLabelIds && {removeLabelIds}
    };
    this.props.modifyMessages({ ids, ...actionParams});
  }

  render() {

    let checked = false;
    let selectedMessages = [];

    if (this.props.messagesResult) {
      selectedMessages = this.props.messagesResult.messages.filter(el => el.selected);
      checked = this.props.messagesResult.messages.length > 0 &&  selectedMessages.length === this.props.messagesResult.messages.length;
    }

    return (
      <div className="msg-toolbar">
        <div className="pl-2 py-2 pr-4 d-flex align-items-center bd-highlight ">
          <div className="d-flex align-content-center align-items-center">
            <div>
              <Checkbox checked={checked} onChange={this.onSelectionChange} />
            </div>
            <div />

            <div className="ml-auto p-2 bd-highlight">
              <div>
                {selectedMessages.length ? (
                  <ListActionButtons onClick={this.modifyMessages} />
                ) : null}
              </div>
            </div>
          </div>

          <Pager
            nextToken={this.props.nextToken}
            prevToken={this.props.prevToken}
            navigateToPrevPage={this.navigateToPrevPage}
            navigateToNextPage={this.navigateToNextPage}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  messagesResult: state.messagesResult
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleSelected,
      modifyMessages
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageToolbar);
