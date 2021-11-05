import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ENDPOINT, DATASET } from './helpers/queries';
import './index.css';

ReactDOM.render(<App url={ENDPOINT} dataset={DATASET} />, document.getElementById('app'));
