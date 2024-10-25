
import React from 'react';
import { ToastContainer } from 'react-toastify';
import OperationsHome from './components/OperationsHome';
import './index.css';

function App() {
    return (
        <div className="App">
            <ToastContainer />
            <OperationsHome />
           
        </div>
    );
}

export default App;
