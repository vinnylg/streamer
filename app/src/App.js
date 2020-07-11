import React, { useState, useEffect } from 'react'
import axios from 'axios'

import SideMenu from './components/SideMenu'
import Header from './components/Header'
import Video from './components/Video'
import Recents from './components/Recents'

import './styles/app.css'

const App = () => {
	const [open, setOpen] = useState(false)
	const [items, setItems] = useState([])
	const [videoPath, setVideoPath] = useState('')
	const [videoType, setVideoType] = useState('')

	useEffect(() => {
		axios
			.get('/list?path=' + window.location.pathname)
			.then(res => console.log(res))
			.catch(err => console.log(err))
	}, [])

	const toogleNav = () => setOpen(prev => !prev)

	return (
		<React.Fragment>
			<SideMenu open={open} toogleNav={toogleNav} items={items} />
			<div style={{ marginLeft: open ? '300px' : '0' }}>
				<Header toogleNav={toogleNav} />
				<div className="box">
					<Video src={videoPath} type={videoType} />
					<Recents />
				</div>
			</div>
		</React.Fragment>
	)
}

export default App
