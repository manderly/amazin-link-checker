import React from 'react'
import renderer from 'react-test-renderer'
import toJson from 'enzyme-to-json'
import { shallow } from 'enzyme';
import * as mockSocket from 'mock-socket';

import LinkCheckerContainer from '../LinkCheckerContainer';

jest.mock('socket.io-client', () => {
  return mockSocket.SocketIO;
});

describe('LinkCheckerContainer', () => {
  test('renders all expected components', () => {
    const container = shallow(<LinkCheckerContainer />);
    expect(container.exists('#app-container')).toBe(true);
  });

  test('renders all expected components without redux demo data', () => {
    const container = shallow(<LinkCheckerContainer />)
    expect(toJson(container)).toMatchSnapshot()
  })

  test('renders all expected components with redux demo data', () => {
    const container = shallow(<LinkCheckerContainer />)
    expect(toJson(container)).toMatchSnapshot()
  });

  test('renders all expected components with redux store', () => {
    const container = renderer.create(<LinkCheckerContainer />)
    expect(container).toMatchSnapshot()
  });

  test('progress bar states', () => {
    const container = shallow(<LinkCheckerContainer />)

    // bar empty, before scraping begins
    container.setState({linksProcessed: 0, affiliateLinkCount: -1, scrapeInProgress: false});
    container.update();
    expect(container.instance().barProgress).toEqual(0);

    // bar in "scraping links" state
    container.setState({linksProcessed: 0, affiliateLinkCount: -1, scrapeInProgress: true});
    container.update();
    expect(container.instance().barProgress).toEqual(2);

    // bar in "processing links" state
    container.setState({linksProcessed: 5, affiliateLinkCount: 10, scrapeInProgress: false});
    container.update();
    expect(container.instance().barProgress).toEqual(50);

    // all done, bar is full
    container.setState({linksProcessed: 10, affiliateLinkCount: 10, scrapeInProgress: false});
    container.update();
    expect(container.instance().barProgress).toEqual(100);

    // bar is full when scrape is done and no links were found 
    container.setState({linksProcessed: 0, affiliateLinkCount: 0, scrapeInProgress: false});
    container.update();
    expect(container.instance().barProgress).toEqual(100);
  });
});
