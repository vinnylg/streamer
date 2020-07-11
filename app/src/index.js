import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route } from 'react-router-dom'
import './styles/index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

ReactDOM.render(
	<Router history={history}>
		<Route>
			<App />
		</Route>
	</Router>,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
