import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Label, Input, FormGroup, Row, Col, FormFeedback } from 'reactstrap'

export default class FormFieldComponent extends Component {
    static propTypes = {
        fieldID: PropTypes.string,
        errorClass: PropTypes.string,
        nameVal: PropTypes.string,
        val: PropTypes.string,
        placeholderText: PropTypes.string
    }

    static defaultProps = {
        fieldID: '',
        labelContents: '',
        errorClass: '',
        nameVal: '',
        val: '',
        placeholderText: ''
    }

    render() {
        const { fieldID, labelContents, errorClass, nameVal, val, handleChange, handleBlur, feedbackText, placeholderText } = this.props;
        return (
            <Row form>
                <Col lg={12}>
                    <FormGroup>
                        <Label for={fieldID}>{labelContents}</Label>
                        <Input
                            className={errorClass}
                            type="text"
                            name={nameVal}
                            value={val}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            id={fieldID}
                            placeholder={placeholderText} />
                        <FormFeedback>{feedbackText}</FormFeedback>
                    </FormGroup>
                </Col>
            </Row>
        )
    }
}

