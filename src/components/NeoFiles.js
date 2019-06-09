import React, { Component } from 'react';
import './NeoFiles.css';
import { NeoFile } from './NeoFile'

class NeoFiles extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        }
    }

    renderNeoFile(name, size) {
        return <NeoFile name={name} size={size} />;
    }

    componentDidMount() {
        fetch("http://localhost:8080/api/v1/list")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.fs_objects,
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
    getFiles() {}

    render() {
        //const fileList = [{'name': 'A', 'size': '10MB'}, {'name': 'B', 'size': '2.1GB'}];
        //const filesDiv = fileList.map(f => this.renderFile(f['name'], f['size']));

        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div> Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div> Loading ... </div>;
        } else {
            const filesDiv = items.map(f => this.renderNeoFile(f.name, f.human_size));
            return (
                <div className="NeoFiles">
                  {filesDiv}
                </div>
            );
        }
    }
}

export default NeoFiles;
