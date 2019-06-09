import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import download from 'downloadjs';
import Modal from 'react-modal';
import ImageGallery from 'react-image-gallery';
import './Files.css';

Modal.setAppElement(document.getElementById('root'));
class Files extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            images: [],
            isModalOpen: false
        };
        this.uploadBtn = React.createRef();

        this.uploadFiles = this.uploadFiles.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.host = 'https://neo.yashmehrotra.com';
        this.pattern = /([.|\w|\s|-])*\.(?:jpg|gif|png)/g;
        this.images = [];
    }

    openModal() {
        this.setState({ isModalOpen: true });
    }

    closeModal() {
        this.setState({ isModalOpen: false });
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

    handleFileClick(file) {
        if (this.pattern.test(file.name)) {
            this.images = this.state.images.map(file => {
                const path = `https://neo.yashmehrotra.com/api/v1/get?path=${file.full_path}`;
                return({
                    original: path,
                    thumbnail: path
                });
            })
            this.openModal();
        }
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
                    const images = result.fs_objects.filter(file => this.pattern.test(file.name));
                    this.setState({
                        isLoaded: true,
                        items: result.fs_objects,
                        images
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
                                        <div onClick={() => this.handleFileClick(f)}>
                                            <img src="/file.jpg" alt="file" className="image-hai" />
                                            {f.name} <small>{f.human_size}</small>
                                            <button 
                                                onClick={() => this.downloadFile(`${pathname}/${f.name}`)} 
                                                className="download-btn"
                                            >
                                                Download
                                            </button>
                                        </div>
                                    )}
                                </li>
                            )) : <li className="text-center">Folder Empty</li>
                        }
                    </ul>
                    <Modal
                        isOpen={this.state.isModalOpen}
                        onRequestClose={this.closeModal}
                        contentLabel="Image Modal"
                        className="modal"
                    >
                        <ImageGallery 
                            items={this.images}
                            showPlayButton={false}
                        />
                    </Modal>
                </div>
            );
        }
    }
}

export default Files;
