import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Col}  from 'reactstrap'
import { FormFieldComponent } from 'components';

import styles from './FormComponent.scss'

export default class FormComponent extends Component {
  static propTypes = {
    dispatch: PropTypes.func
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({[event.target.name]: event.target.value}, () => {
      this.isInputValid({name, value});
    });
  }

  handleBlur = (event) => {
    const { name } = event.target;
    this.setState({[name]: event.target.value});
  }

  isInputValid = field => {
    const { name, value } = field;
    const fieldError = `${name}Error`;

    if (this.state[name] === '') {
      // this field is empty
      this.setState({[fieldError]: true});
    } else {
      // something exists in this field 
      if (name === "userUrl") {
        // see if this at least resembles a URL 
        // if it has http:// or https://, it's good enough for us
        const hasHTTP = new RegExp(/(http:\/\/|https:\/\/)/).test(value);
        if (hasHTTP) {
          //console.log("this url has http!", value);
          this.setState({[fieldError]: false});
        } else {
          //console.log("This url does not have http(s)://", value);
          this.setState({[fieldError]: true});
        }
      } else {
        this.setState({[fieldError]: false});
      }
    }
  }

  validateForm = () => {
    //mark every field as touched
    this.setState({
      touched: { 
        'userTag': true,
        'userAccessKey': true,
        'userSecret':true,
        'userUrl':true 
      },
    });

    this.isInputValid({name: 'userTag', value: this.state.userUrl});
    this.isInputValid({name: 'userAccessKey', value: this.state.userAccessKey});
    this.isInputValid({name: 'userSecret', value: this.state.userSecret});
    this.isInputValid({name: 'userUrl', value: this.state.userUrl});
  }

  state = {
    userUrl:'',
    userTag: '',
    userAccessKey: '',
    userSecret: '',
    touched: {
      'userTag': false,
      'userAccessKey': false,
      'userSecret': false,
      'userUrl': false
    }
  }

  render () {
    const { handleClick } = this.props;
    const { userUrl, userTag, userAccessKey, userSecret } = this.state;

    const shouldMarkError = (errorField) => {
      // mark the field as being in error state if an error exists for it AND if it's been touched by the user
      const hasError = this.state[errorField]; //errorField; // looks like 'userTagError'   //errors[field];
      const inputField = errorField.replace("Error", ""); // remove the Error part
      const touched = this.state.touched[inputField]; 
      //console.log(inputField + " error status: " + hasError + " | touched status is: " + touched);

      // if this field has an error, return true if touched is true, else false 
      return hasError ? touched : false;
    };

    return (
      <Col lg={6}>
        <div className={styles.formComponent}>
          <Form>
            <FormFieldComponent 
              labelContents={<span>Your <a href="https://docs.aws.amazon.com/AWSECommerceService/latest/DG/becomingAssociate.html">Amazon Associate</a> Tag</span>} 
              errorClass={shouldMarkError('userTagError') ? "is-invalid" : ""}
              nameVal="userTag"
              val={userTag}
              fieldID="enter-tag"
              handleChange={this.handleChange}
              handleBlur={this.handleBlur}
              placeholderText="your-tag-20"
              feedbackText="Must include Amazon Associate Tag"/>

            <FormFieldComponent 
              labelContents={<span>Your <a href="https://docs.aws.amazon.com/AWSECommerceService/latest/DG/becomingDev.html">Access Key ID</a></span>}
              errorClass={shouldMarkError('userAccessKeyError') ? "is-invalid" : ""}
              nameVal="userAccessKey"
              val={userAccessKey} 
              fieldID="enter-key-id" 
              handleChange={this.handleChange}
              handleBlur={this.handleBlur}
              placeholderText="Access key ID" 
              feedbackText="Please provide your Access Key ID"/>

            <FormFieldComponent 
              labelContents={<span>Your <a href="https://docs.aws.amazon.com/AWSECommerceService/latest/DG/becomingDev.html">Secret Access Key</a></span>}
              errorClass={shouldMarkError('userSecretError') ? "is-invalid" : ""}
              nameVal="userSecret"
              val={userSecret}
              fieldID="enter-secret" 
              handleChange={this.handleChange}
              handleBlur={this.handleBlur}
              placeholderText="Secret Access Key" 
              feedbackText="Please provide your Secret Access Key"/>

            <FormFieldComponent 
              labelContents={'Your Article URL'}
              errorClass={shouldMarkError('userUrlError') ? "is-invalid" : ""}
              nameVal="userUrl"
              val={userUrl} 
              fieldID="enter-url"
              handleChange={this.handleChange}
              handleBlur={this.handleBlur}
              placeholderText="http://your-site.com/yourarticle" 
              feedbackText="Must enter the URL to an article (include http:// or https://)"/>
              
            <Button
              id="button-submit-form"
              color="primary"
              onClick={() => handleClick(userUrl, this.validateForm, userAccessKey, userSecret, userTag)}>
            Test
            </Button>
          </Form>
        </div>
      </Col>
    )
  }
}