import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import download from 'downloadjs';
import './Files.css';

class Files extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
        this.uploadBtn = React.createRef();
        this.uploadFiles = this.uploadFiles.bind(this);
        this.host = 'https://neo.yashmehrotra.com';
    }

    uploadFiles() {
        const form = new FormData();
        const file = this.uploadBtn.current.files[0];
        form.append("file[]", file);
        fetch(`${this.host}/api/v1/put`, {
            method: 'PUT',
            body: form
        })
        .then(response => response.json())
        .then(success => alert("Uploaded"))
        .catch(error => console.log(error));
    }

    downloadFile(path) {
        const pathname = this.props.location.pathname === '/' ? "" : this.props.location.pathname;
        const name = path.replace(`${pathname}/`, "");
        fetch(`${this.host}/api/v1/get?path=${path}`)
        .then(response => response.blob())
        .then(response => download(response, name, response.type))
        .catch(error => console.log(error));
    }

    componentDidMount() {
        this.getFiles(this.props.location.pathname);
    }

    shouldComponentUpdate(nextProps) {
        const { location } = nextProps;
        if (this.props.location.pathname !== location.pathname) {
            this.getFiles(location.pathname);
        }
        return true;
    }

    getFiles(path='/') {
        fetch(`${this.host}/api/v1/list?path=${path}`)
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

    render() {
        const { error, isLoaded, items } = this.state;
        const pathname = this.props.location.pathname === '/' ? "" : this.props.location.pathname;
        if (error) {
            return <div> Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div> Loading ... </div>;
        } else {
            return (
                <div>
                    {<input type="file" ref={this.uploadBtn} onChange={this.uploadFiles} />}
                    <ul className="files">
                        {
                            items ? items.map(f => (
                                <li key={f.name} className="file">
                                    {f.is_dir ? (
                                        <Link to={`${pathname}/${f.name}`}>
                                            <img src="/folder.jpg" alt="folder" className="image-hai" /> {f.name}
                                        </Link>
                                    ) : (
                                        <div>
                                            <img src="/file.jpg" alt="file" className="image-hai" />{f.name} <small>{f.human_size}</small><button onClick={() => this.downloadFile(`${pathname}/${f.name}`)} className="download-btn">Download</button>
                                        </div>
                                    )}
                                </li>
                            )) : <li className="text-center">Folder Empty</li>
                        }
                    </ul>
                </div>
            );
        }
    }
}

export default Files;
