import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import FormComponent from '../FormComponent'

describe('FormComponent', () => {
  test('renders itself with defaults', () => {
    const component = renderer.create(<FormComponent />)
    expect(component).toMatchSnapshot()
  })

  test('renders itself text prop', () => {
    const component = renderer.create(<FormComponent/>)
    expect(component).toMatchSnapshot()
  })

  test('should call mock function when button is clicked', () => {
    const mockFunc = jest.fn();
    const component = shallow(<FormComponent handleClick={mockFunc}/>);
    const submitButton = component.find('#button-submit-form')
    submitButton.simulate('click');
    expect(mockFunc).toHaveBeenCalled();
  })
})