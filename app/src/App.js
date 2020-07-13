import React, { useState, useEffect } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import axios from 'axios'

import SideMenu from './components/SideMenu'
import Header from './components/Header'
import Video from './components/Video'

import './styles/app.css'

const api = axios.create()

const App = () => {
	const location = useLocation()

	const [open, setOpen] = useState(false)
	const [marginLeft, setMarginLeft] = useState('0')
	const [error, setError] = useState(false)
	const [items, setItems] = useState([])
	const [videoPath, setVideoPath] = useState('')
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

	useEffect(() => {
		if (items && !location.pathname.includes('.')) {
			setOpen(true)
		} else {
			setOpen(false)
		}
	}, [items, location])

	useEffect(() => {
		let widthSize = Math.round(window.innerWidth * (300 / 1366))
		if (open) {
			setMarginLeft(widthSize + 'px')
		} else {
			setMarginLeft('0')
		}
	}, [open])

	const toogleNav = () => setOpen(prev => !prev)

	return (
		<React.Fragment>
			{error && <Redirect to="/" />}
			<SideMenu
				open={open}
				width={marginLeft}
				toogleNav={toogleNav}
				items={items}
			/>
			<div style={{ marginLeft }}>
				<Header toogleNav={toogleNav} menuOpen={open} />
				<div className="box">
					{videoPath && (
						<Video src={videoPath} type={videoType} items={items} />
					)}
				</div>
			</div>
		</React.Fragment>
	)
}

export default App
