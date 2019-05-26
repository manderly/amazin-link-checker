import React, { Component } from 'react'
import { Button } from 'reactstrap';

export default class RecentLinkComponent extends Component {

    static defaultProps = {
        recentLink: ''
    }

    render() {
        const { recentLink, index, handleClick } = this.props;

        return (
            <tr>
                <td className="tableUsersLinkText">
                    <a href={recentLink} id={"recent-url-" + index}>{recentLink}</a>
                </td>
                <td width='80'>
                    <Button
                        color="warning"
                        size="sm"
                        id={"button-retest-" + index}
                        onClick={handleClick}>
                        Re-test
                              </Button>
                </td>
            </tr>
        )
    }
}
