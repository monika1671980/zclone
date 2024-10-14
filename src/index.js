import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
import  Router from './Components/Router';
import NodeVersion from './nodeversion';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   
    < Router/>,
    <NodeVersion/>
   
  </React.StrictMode>
);

