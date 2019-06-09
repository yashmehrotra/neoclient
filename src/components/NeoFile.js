import React, { Component } from 'react';

class NeoFile extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log("Hello");
    }

    render() {
        return (
            <div className="neofile" onClick={this.handleClick}>
              {this.props.name} {this.props.size}
            </div>
        );
    }
}