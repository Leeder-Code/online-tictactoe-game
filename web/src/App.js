import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import './styles/style.css'
import Join from './components/Join/Join'
import Game from './components/Chat/Game'

const App = () => {
    return ( 
        <main>
            <Router>
                <Route path="/" exact component={Join}/>
                <Route path='/game' component={Game}/>
            </Router>
        </main>
     );
}
 
export default App;