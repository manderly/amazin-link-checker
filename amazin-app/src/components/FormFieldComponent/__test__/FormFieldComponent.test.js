import React from 'react'
import renderer from 'react-test-renderer'

import FormFieldComponent from '../FormFieldComponent'

const handleChange = jest.fn();
const handleBlur = jest.fn();

describe('FormFieldComponent', () => {
    test('renders itself with defaults', () => {
        const component = renderer.create(<FormFieldComponent />)
        expect(component).toMatchSnapshot()
    })

    test('renders itself text prop', () => {
        const component = renderer.create(<FormFieldComponent
            labelContents="Test label here"
            errorClass=""
            nameVal="http://localhost.test/"
            val="test-val"
            fieldID="test-id"
            handleChange={handleChange}
            handleBlur={handleBlur}
            placeholderText="http://localhost.test/yourarticle"
            feedbackText="Test feedback text here"
        />)
        expect(component).toMatchSnapshot()
    })
})