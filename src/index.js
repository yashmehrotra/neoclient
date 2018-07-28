import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Files from './Files';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Files />, document.getElementById('root'));
registerServiceWorker();
