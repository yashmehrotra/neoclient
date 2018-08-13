import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
    }

    handleClick(file) {
        if (file.is_dir) {
            this.getFiles(file.full_path);
        }
    }

    uploadFiles() {
        const form = new FormData();
        const file = this.uploadBtn.current.files[0];
        form.append("file[]", file);
        fetch('http://localhost:8080/api/v1/put', {
            method: 'PUT',
            body: form
        })
        .then(response => response.json())
        .then(success => console.log(success))
        .catch(error => console.log(error));
    }

    componentDidMount() {
        const { match } = this.props;
        console.log(match);
        this.getFiles();
    }

    getFiles(path='/') {
        fetch(`http://localhost:8080/api/v1/list?path=${path}`)
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
        if (error) {
            return <div> Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div> Loading ... </div>;
        } else {
            return (
                <div>
                    <input type="file" ref={this.uploadBtn} onChange={this.uploadFiles} />
                    <ul className="Files">
                        {
                            items.map(f => (
                                <li key={f.name} className="file">
                                    <Link to={f.name}>
                                        {f.name} <small>{f.is_dir ? '' : f.human_size}</small>
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            );
        }
    }
}

export default Files;
