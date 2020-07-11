import React, { useState, useEffect } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import axios from 'axios'

import SideMenu from './components/SideMenu'
import Header from './components/Header'
import Video from './components/Video'

import './styles/app.css'

const api = axios.create({
	baseURL: 'http://localhost:5000'
})

const App = () => {
	const location = useLocation()

	const [open, setOpen] = useState(false)
	const [error, setError] = useState(false)
	const [items, setItems] = useState([])
	const [videoPath, setVideoPath] = useState('')
	// const [videoPath, setVideoPath] = useState('fairy-tail/season-1/001.mp4')
	const [videoType, setVideoType] = useState('')

	useEffect(() => {
		setVideoPath('')
		setVideoType('')
		let pathname = location.pathname
		if (pathname.includes('.')) {
			setVideoPath('/video?path=' + pathname)
			setVideoType('video/' + pathname.split('.')[1])
			pathname = pathname
				.split('/')
				.filter(part => !part.includes('.'))
				.join('/')
		}
		api
			.get('/list?path=' + pathname)
			.then(({ data }) => {
				setError(false)
				setItems(data.items)
			})
			.catch(err => {
				setError(true)
			})
	}, [location])

	const toogleNav = () => setOpen(prev => !prev)

	return (
		<React.Fragment>
			{error && <Redirect to="/" />}
			<SideMenu open={open} toogleNav={toogleNav} items={items} />
			<div style={{ marginLeft: open ? '300px' : '0' }}>
				<Header toogleNav={toogleNav} />
				<div className="box">
					{videoPath && <Video src={videoPath} type={videoType} />}
				</div>
			</div>
		</React.Fragment>
	)
}

export default App
