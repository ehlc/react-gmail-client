import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import { bindActionCreators, compose } from "redux";
import {
  getEmailMessage,
  modifyMessages
} from "../actions/message-list.actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import MessageToolbar from "../message-toolbar/MessageToolbar";

import "./messageContent.scss";

export class MessageContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: undefined
    };

    this.iframeRef = React.createRef();
    this.modifyMessage = this.modifyMessage.bind(this);
  }

  componentDidMount(prevProps) {
    const messageId = this.props.match.params.id;
    this.props.getEmailMessage(messageId);
  }

  componentDidUpdate(prevProps) {
    const { emailMessageResult } = this.props;
    if (!emailMessageResult.loading) {
      if (!emailMessageResult.failed) {
        if (this.iframeRef.current) {
          const { body } = this.iframeRef.current.contentWindow.document;
          body.style.margin = "0px";
          body.style.fontFamily = "Arial, Helvetica, sans-serif";
          body.style.fontSize = "13px";
          body.innerHTML = this.props.emailMessageResult.body;
        }
      } else {
        if (!this.state.errorMessage) {
          this.setState({
            errorMessage: emailMessageResult.error.result.error.message,
            modal: true
          });
        }
      }
    }
  }

  renderSpinner() {
    return (
      <div className="d-flex h-100 justify-content-center align-items-center  ">
        <FontAwesomeIcon icon={faSpinner} spin size="5x" />
      </div>
    );
  }

  renderErrorModal() {
    return <Redirect to="/notfound" />;
  }

  modifyMessage(addLabelIds, removeLabelIds) {
    const id = this.props.emailMessageResult.result.id;
    const actionParams = {
      ...(addLabelIds && { addLabelIds }),
      ...(removeLabelIds && { removeLabelIds })
    };
    this.props.modifyMessages({ ids: [id], ...actionParams });
    this.props.history.goBack();
  }

  render() {
    if (this.props.emailMessageResult.loading) {
      return this.renderSpinner();
    }

    return (
      <React.Fragment>
        <MessageToolbar 
          onClick={this.modifyMessage} 
          messageResult={this.props.emailMessageResult}
        />
        <div className="d-flex justify-content-center align-items-center message-content">
          {this.props.emailMessageResult.loading ? this.renderSpinner() : null}
          {this.state.errorMessage ? (
            this.renderErrorModal()
          ) : (
            <iframe
              ref={this.iframeRef}
              title="Message contents"
              id="message-iframe"
              style={{
                display: this.props.emailMessageResult.loading
                  ? "none"
                  : "block"
              }}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  emailMessageResult: state.emailMessageResult
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getEmailMessage,
      modifyMessages
    },
    dispatch
  );

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MessageContent);
