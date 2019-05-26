import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import RecentLinkComponent from '../RecentLinkComponent'

describe('RecentLinkComponent', () => {
    const mockFunc = jest.fn();
    const mockLink = 'http://recent-link-component.com';

    test('renders itself with defaults', () => {
        const component = renderer.create(<RecentLinkComponent />)
        expect(component).toMatchSnapshot()
    })

    test('renders itself text prop', () => {
        const component = renderer.create(<RecentLinkComponent />)
        expect(component).toMatchSnapshot()
    })

    test('link text matches what was given', () => {
        const component = shallow(<RecentLinkComponent
            recentLink={mockLink}
            index={0}
            handleClick={mockFunc} />);
        expect(component.find('#recent-url-0').text()).toEqual(mockLink);
    });

    test('should call mock function when button is clicked', () => {
        const component = shallow(<RecentLinkComponent
            recentLink={mockLink}
            index={0}
            handleClick={mockFunc} />);
        const submitButton = component.find('#button-retest-0')
        submitButton.simulate('click');
        expect(mockFunc).toHaveBeenCalled();
    })
})