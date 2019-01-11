import React, { PureComponent } from "react";
import { sendMessage } from "../../api";
import { getValidEmails } from "../../utils";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputGroupAddon,
  Input
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import ReactQuill from "react-quill";
import "../../../node_modules/react-quill/dist/quill.snow.css";
import "./composeMessage.scss";

export class Compose extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      displayModal: false,
      to: props.to || "",
      cc: props.cc || "",
      bcc: props.bcc || "",
      subject: props.subject || "",
      content: props.content || ""
    };

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.setField = this.setField.bind(this);
  }

  showModal() {
    this.setState({
      displayModal: true
    });
  }

  closeModal() {
    this.setState({
      displayModal: false
    });
  }

  handleChange(value) {
    this.setState({ content: value });
  }

  sendEmail() {
    const validTo = getValidEmails(this.state.to);

    if (
      !validTo.length ||
      this.state.subject.trim() === "" ||
      this.state.content === ""
    ) {
      return;
    }

    const headers = {
      To: validTo.join(", "),
      Subject: this.state.subject
    };

    const validCc = getValidEmails(this.state.cc);
    if (validCc.length) {
      headers.Cc = validCc.join(", ");
    }

    const validBcc = getValidEmails(this.state.bcc);
    if (validBcc.length) {
      headers.Bcc = validBcc.join(", ");
    }

    sendMessage({
      headers,
      body: this.state.content
    }).then(_ => {      
      this.closeModal();
      this.resetFields();
    });

    this.closeModal();
  }

  resetFields() {
    this.setState({
      to: this.props.to || "",
      cc: this.props.cc || "",
      bcc: this.props.bcc || "",
      subject: this.props.subject || "",
      content: this.props.content || ""
    });
  }

  setField(field, trimValue = true) {
    return evt => {
      this.setState({
        [field]: trimValue ? evt.target.value.trim() : evt.target.value 
      });
    };
  }

  isInvalid(field) {
    const fieldValue = this.state[field].trim();
    return fieldValue.length > 0 && !getValidEmails(fieldValue).length;
  }

  
  render() {
    return (
      <React.Fragment>
        {
          React.cloneElement(this.props.children, {
            onClick: this.showModal
          })
        }
        {this.state.displayModal ? (
          <Modal
            isOpen={this.state.displayModal}
            className="compose-dialog"
            size="lg"
            onOpened={this.onModalOpened}
            backdrop="static"
            centered={true}
          >
            <ModalHeader toggle={this.closeModal}>Compose Message</ModalHeader>
            <ModalBody>
              <div className="message-fields">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">To:</InputGroupAddon>
                  <Input
                    tabIndex={1}
                    value={this.state.to}
                    placeholder="comma-separated email list"
                    invalid={this.isInvalid("to")}
                    onChange={this.setField("to")}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">Cc:</InputGroupAddon>
                  <Input
                    tabIndex={2}
                    value={this.state.cc}
                    placeholder="comma-separated email list"
                    invalid={this.isInvalid("cc")}
                    onChange={this.setField("cc")}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">Bcc:</InputGroupAddon>
                  <Input
                    tabIndex={3}
                    placeholder="comma-separated email list"
                    invalid={this.isInvalid("bcc")}
                    onChange={this.setField("bcc")}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    Subject:
                  </InputGroupAddon>
                  <Input
                    tabIndex={4}
                    placeholder=""
                    value={this.state.subject}
                    onChange={this.setField("subject", false)}
                  />
                </InputGroup>
              </div>
              <div className="editor-wrapper">
                <ReactQuill
                  tabIndex={5}
                  value={this.state.content}
                  onChange={this.handleChange}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                className="mr-auto font-weight-bold"
                size="lg"
                color="primary"
                onClick={this.sendEmail}
                title="Send message"
              >
                Send
              </Button>{" "}
              <Button title="Discard" color="light" onClick={this.closeModal}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </ModalFooter>
          </Modal>
        ) : null}
      </React.Fragment>
    );
  }
}

export default Compose;
