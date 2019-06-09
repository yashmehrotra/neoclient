import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { NeoFiles } from './componenets/NeoFiles';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<NeoFiles />, document.getElementById('root'));
registerServiceWorker();
