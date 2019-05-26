import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Container, Table, Jumbotron, Row, Col, Progress, Button } from 'reactstrap';
import { FormComponent, RecentLinkComponent } from 'components';
//import * as Scroll from 'react-scroll';
import { Element, Events, animateScroll as scroll, scrollSpy } from 'react-scroll'
import io from 'socket.io-client';

import styles from './LinkCheckerContainer.scss';

const socket = io('http://localhost:3000');


export default class LinkCheckerContainer extends Component {
    constructor(props) {
        super(props);
        this.barProgress = 0;
    }

    static propTypes = {
        dispatch: PropTypes.func
    }

    state = {
        scrapeInProgress: false,
        links: [],
        affiliateLinkCount: -1,
        recentArticles: [],
        linksProcessed: 0,
        currentArticleLink: '',
        socketID: '',
        testStopped: false
    }

    componentDidMount() {
        socket.on('connect', () => {
            if (socket.id) {
                //console.log('connected to the server, id: ', socket.id);
                this.setState({ socketID: socket.id });
            } else {
                console.log("no socket id");
            }
        });

        socket.on('staticDataReceived', (data) => {
            if (data.length) {
                this.setState({ links: data });
            }
            //else, no data was received 
        })

        socket.on('serverDataReceived', (data) => {
            //gets it piecemeal
            if (data) {
                this.setState({ links: [...this.state.links, data] });
                this.setState({ linksProcessed: this.state.linksProcessed + 1 });
                if (this.state.linksProcessed >= this.state.count) {
                    this.setState({ scrapeInProgress: false });
                }
            }
        });

        socket.on('urlsScraped', (count) => {
            this.setState({ affiliateLinkCount: count });
            this.setState({ linksProcessed: 0 });
            this.setState({ links: [] });
        });

        Events.scrollEvent.register('begin', function (to, element) {
            //console.log("begin", arguments);
        });

        Events.scrollEvent.register('end', function (to, element) {
            //console.log("end", arguments);
        });

        scrollSpy.update();
    }

    componentWillUnmount() {
        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');
        socket.removeListener('staticDataReceived');
        socket.removeListener('urlsScraped');
        socket.removeListener('serverDataReceived');
    }


    handleClick = (userUrl, validateForm, userAccessKey, userSecret, userTag) => {
        // only used for the form, no call to validateForm is made when using a re-test button
        let usingRetest = true;
        if (validateForm) {
            validateForm();
            usingRetest = false;
        }

        const hasHTTP = new RegExp(/(http:\/\/|https:\/\/)/).test(userUrl);
        if (hasHTTP) {
            if (userAccessKey && userSecret && userTag) {
                this.setState({ scrapeInProgress: true });
                this.setState({ links: [] });
                this.setState({ count: 0 });
                this.setState({ linksProcessed: 0 });
                this.setState({ affiliateLinkCount: -1 });
                this.setState({ currentArticleLink: userUrl });
                this.setState({ userAccessKey: userAccessKey });
                this.setState({ userSecret: userSecret });
                this.setState({ userTag: userTag });

                if (!usingRetest) {
                    //so re-tested URLs dont get re-added to the recently tested list 
                    this.setState({ recentArticles: [userUrl, ...this.state.recentArticles] });
                }

                /* would rather use this one but it doesn't work 
                scroll.scrollTo('scrollToElement', {
                  duration: 800,
                  delay: 0,
                  smooth: 'easeInOutQuart',
                  containerId: 'app-container',
                  isDynamic: true
                }) */

                scroll.scrollToBottom();

                //dispatch(fetchDemo(userUrl, this.state.socketID));
                this.setState({ testStopped: false });
                socket.emit('beginProcessing', userUrl, this.state.socketID, this.state.userAccessKey, this.state.userSecret, this.state.userTag);
            } else {
                //console.log("One or more Amazon credential is missing");
            }
        } else {
            //console.log("This url does not have http(s)://", userUrl);
        }
    }

    displayAmazonResults(results = []) {
        return results.filter(l => l !== null && l !== undefined)
            .map((linkData, index) => {
                const item = linkData;
                let icon = "glyphicon glyphicon-remove text-danger";
                if (item.validOnAmazon) {
                    icon = "glyphicon glyphicon-ok text-success";
                }

                let tableRow = <tr key={index}>
                    <td className="tableUsersLinkText">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">{item.urlText}</a>
                    </td>
                    <td>
                        <span className={icon}></span>
                    </td>
                    <td className="tableProductTitle">{item.itemName}<br /><small><b>Tag: {item.tag}</b></small></td>
                </tr>;
                return item || item.url ? tableRow : null;
            });
    }

    displayRecentArticles(results = []) {
        return results.filter(l => l !== null && l !== undefined)
            .map((recentLink, index) => {
                let listItem = <RecentLinkComponent recentLink={recentLink} handleClick={() => this.handleClick(recentLink, '', this.state.userAccessKey, this.state.userSecret, this.state.userTag)} key={index} index={index} />;
                return (index < 8) ? listItem : null
            })
    }

    stopOrRestartCurrentTest(url, progress) {
        if (progress < 100) {
            //stopping (halting) current test
            this.setState({ testStopped: true });
            socket.emit('stopSignal', this.state.socketID);
        } else if (progress >= 100) {
            //restarting current test
            //re-uses saved user credentials; may want to take from form again 
            this.handleClick(url, '', this.state.userAccessKey, this.state.userSecret, this.state.userTag);
        }

    }

    render() {
        const { links, affiliateLinkCount, recentArticles, linksProcessed, scrapeInProgress, currentArticleLink } = this.state;

        const items = links.length ? this.displayAmazonResults(links) : null;
        const articleLinks = recentArticles.length ? this.displayRecentArticles(recentArticles) : null;

        let progressText = `Reticulating splines...`;

        if (this.state.testStopped) {
            this.barProgress = 100;
            progressText = `Test stopped by user!`;
        } else {
            if (linksProcessed === 0 && affiliateLinkCount === -1) {
                if (scrapeInProgress) {
                    this.barProgress = 2;
                    progressText = `Scraping your site for Amazon links...`;
                }
            } else if (linksProcessed === 0 && affiliateLinkCount === 0) {
                //done scraping and no links were found
                this.barProgress = 100;
                progressText = `No links found`;
            } else if (linksProcessed > 0 && linksProcessed < affiliateLinkCount) {
                // started to process links but not done yet 
                this.barProgress = ((linksProcessed / affiliateLinkCount) * 100);
                progressText = `Processing link (${linksProcessed}/${affiliateLinkCount})`;
            } else if (linksProcessed >= affiliateLinkCount) {
                // processed all the links (done)
                this.barProgress = 100;
                progressText = `Done!`;
            }
        }

        return (
            <div>
                <Container id="app-container" className={styles.LinkCheckerContainer}>

                    <Jumbotron fluid>
                        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" />
                        <h2 id="link-checker-title">Amazin' Affiliate Link Checker</h2>
                        <p>Identify broken, outdated and mis-tagged Amazon product links in your blog articles.<br />Requires an Amazon Associates account and Amazon Product Advertising API credentials. <a href="/"><br />Watch a demo video.</a></p>

                        <Row>
                            <FormComponent handleClick={this.handleClick} />

                            <Col lg={6}>
                                <div>
                                    <h4>Recently tested urls</h4>
                                    <Table>
                                        <tbody id="recent-article-links">
                                            {articleLinks}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>

                    </Jumbotron>

                    <Element name="scrollToElement" className="element"></Element>

                    <div className={(this.barProgress === 0) ? 'hidden' : ''}>
                        <h3 id="progress">Progress</h3>
                        <p className={(currentArticleLink === '') ? 'hidden' : ''}><label>Your article's URL</label><br /> <a href={currentArticleLink}>{currentArticleLink}</a></p>

                        <div className="pad-bottom">
                            <div className="text-center">{progressText}
                                <Progress color="info" value={this.barProgress} />
                            </div>
                            <Button
                                className={(this.barProgress < 100) ? 'btn-danger center-block' : 'btn-warning center-block'}
                                onClick={() => this.stopOrRestartCurrentTest(currentArticleLink, this.barProgress)}
                            >
                                {(this.barProgress < 100 && !this.state.testStopped) ? 'Stop test' : 'Re-run test'}
                            </Button>
                        </div>
                    </div>

                    <div className={(linksProcessed === 0) ? 'hidden' : ''}>
                        <h3>Results</h3>
                        <p>{linksProcessed} / {affiliateLinkCount} Affiliate links processed</p>
                        <Table hover size="sm">
                            <thead>
                                <tr>
                                    <th width='120'>Your article's Amazon links</th>
                                    <th width='60'>Valid</th>
                                    <th width='300'>Product title</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items}
                            </tbody>
                        </Table>
                    </div>
                </Container>

                <Container fluid className="dark-grey-bg">
                    <Row className="pad-footer">
                        <Col lg="5">
                            <label>Who this tool is for</label>
                            <p>This tool is intended for Amazon Associates ("affiliates") with established websites.</p>
                            <label>Why use this tool</label>
                            <p>For a variety of reasons, your site's Amazon.com product links may become outdated. When this happens, your visitors end up on 404 pages ("dog pages") instead of the product(s) you meant to show them. This tool helps you quickly locate those dead links.</p>
                            <label>How it works</label>
                            <p>This tool scans your article for Amazon product links. It extracts a product ID from each link and checks that the product ID is valid. This website does not store your credentials or any information about your site.</p>
                        </Col>
                        <Col lg="1"></Col>
                        <Col lg="5">
                            <label>Interpreting your results</label>
                            <p>Unfortunately, not every product on Amazon is in the Amazon Product Advertising API. Valid links may be marked "invalid" by this tool if the product doesn't exist in the API, even if it exists on Amazon.</p>
                            <p>The tool also considers links to Amazon.com search results to be "invalid" even though they are perfectly acceptable to Amazon and your site's users.</p>
                            <p>You should manually confirm any "invalid" results you get.</p>
                            <label>About the author</label>
                            <p>This tool was created by blogger and web developer <a href="https://github.com/MJGrant">MJ Grant</a>.</p>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
