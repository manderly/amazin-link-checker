import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Col, Label}  from 'reactstrap'
import { FormFieldComponent } from 'components';

import styles from './FormComponent.scss'

import Select from 'react-select';

const marketplaces = [
  { value: 'www.amazon.com', label: '🇺🇸 United States - www.amazon.com' },
  { value: 'www.amazon.ca', label: '🇨🇦 Canada - www.amazon.ca' },
  { value: 'www.amazon.com.mx', label: '🇲🇽 Mexico - www.amazon.com.mx' },
  { value: 'www.amazon.com.br', label: '🇧🇷 Brazil - www.amazon.com.br' },
  { value: 'www.amazon.co.uk', label: '🇬🇧 United Kingdom - www.amazon.co.uk' },
  { value: 'www.amazon.de', label: '🇩🇪 Germany - www.amazon.de' },
  { value: 'www.amazon.fr', label: '🇫🇷 France - www.amazon.fr' },
  { value: 'www.amazon.es', label: '🇪🇸 Spain - www.amazon.es' },
  { value: 'www.amazon.in', label: '🇮🇳 India - www.amazon.in' },
  { value: 'www.amazon.it', label: '🇮🇹 Italy - www.amazon.it' },
  { value: 'www.amazon.ae', label: '🇦🇪 Arab Emirates - www.amazon.ae' },
  { value: 'www.amazon.sa', label: '🇸🇦 Saudi Arabia - www.amazon.sa' },
  { value: 'www.amazon.com.tr', label: '🇹🇷 Turkey - www.amazon.com.tr' },
  { value: 'www.amazon.nl', label: '🇳🇱 Netherlands - www.amazon.nl' },
  { value: 'www.amazon.co.jp', label: '🇯🇵 Japan - www.amazon.co.jp' },
  { value: 'www.amazon.com.au', label: '🇦🇺 Australia - www.amazon.com.au' },
  { value: 'www.amazon.sg', label: '🇸🇬 Singapore - www.amazon.sg' }
]

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

  selectMarketplace = (event) => {
    console.log(event);
    this.setState({['marketplace']: event.value});
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
        'userUrl':true,
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
    marketplace: marketplaces[0].value,
    userTagError: '',
    userAccessKeyError: '',
    userSecretError: '',
    userUrlError: '',
    touched: {
      'userTag': false,
      'userAccessKey': false,
      'userSecret': false,
      'userUrl': false
    }
  }

  render () {
    const { handleClick } = this.props;
    const { userUrl, userTag, userAccessKey, userSecret, marketplace } = this.state;

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
              labelContents={<span>Your <a href="https://webservices.amazon.com/paapi5/documentation/register-for-pa-api.html">Access Key ID</a></span>}
              errorClass={shouldMarkError('userAccessKeyError') ? "is-invalid" : ""}
              nameVal="userAccessKey"
              val={userAccessKey} 
              fieldID="enter-key-id" 
              handleChange={this.handleChange}
              handleBlur={this.handleBlur}
              placeholderText="Access key ID" 
              feedbackText="Please provide your Access Key ID"/>

            <FormFieldComponent 
              labelContents={<span>Your <a href="https://webservices.amazon.com/paapi5/documentation/register-for-pa-api.html">Secret Access Key</a></span>}
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

            <Label for="marketplace-select">Marketplace</Label>
            <Select
              id="marketplace-select"
              name="marketplace"
              defaultValue={marketplaces[0]}
              options={marketplaces}
              onChange={this.selectMarketplace}
              />

              <br/>
              
            <Button
              id="button-submit-form"
              color="primary"
              onClick={() => handleClick(userUrl, this.validateForm, userAccessKey, userSecret, userTag, marketplace)}>
            Test
            </Button>
          </Form>
        </div>
      </Col>
    )
  }
}