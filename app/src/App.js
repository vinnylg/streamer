import React, { useState, useEffect } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import axios from 'axios'

import SideMenu from './components/SideMenu'
import Header from './components/Header'
import Video from './components/Video'
import Button from './components/Button'

import './styles/app.css'

const api = axios.create()

const App = () => {
	const location = useLocation()
	const [windowSize, setWindowSize] = useState({})
	const [open, setOpen] = useState(false)
	const [marginLeft, setMarginLeft] = useState('0')
	const [headerSize, setHeaderSize] = useState(0)
	const [error, setError] = useState(false)
	const [items, setItems] = useState([])
	const [videoPath, setVideoPath] = useState('')
	const [videoType, setVideoType] = useState('')
	const [watched, setWatched] = useState([])
	const [favorites, setFavorites] = useState([])
	const [continueWatching, setContinueWatching] = useState([])

	useEffect(() => {
		const updateSize = () => {
			let header = document.getElementById('main-header')
			setHeaderSize(header.clientHeight)
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight
			})
		}
		updateSize()
		window.addEventListener('resize', updateSize)
		return () => window.removeEventListener('resize', updateSize)
	}, [])

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
		let widthSize = Math.max(Math.round(windowSize.width * (300 / 1366)), 150)
		if (open) {
			setMarginLeft(widthSize + 'px')
		} else {
			setMarginLeft('0')
		}
	}, [open, windowSize])

	const toogleNav = () => setOpen(prev => !prev)

	const getWatched = () => {
		setFavorites([])
		//send request to get items in location that are in file .watched
		setWatched(['assisti 1', 'assisti 2', 'assisti 3'])
	}

	const getFavorites = () => {
		setWatched([])
		//send request to get items in location that are in file .favorites
		setFavorites(['fav1', 'fav2', 'fav3'])
	}

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
				<Header id="main-header" toogleNav={toogleNav} menuOpen={open} />
				<div
					className="main-container"
					style={{ maxHeight: windowSize.height - headerSize * 2 + 'px' }}
				>
					{continueWatching && <div className="box">{continueWatching}</div>}
					<div className="box">
						{videoPath && (
							<Video src={videoPath} type={videoType} items={items} />
						)}
					</div>
					<div className="box-row">
						<Button
							onClick={getWatched}
							active={watched.length > 0 ? true : false}
						>
							Assistidos
						</Button>
						<Button
							onClick={getFavorites}
							active={favorites.length > 0 ? true : false}
						>
							Favoritos
						</Button>
					</div>
					{(watched || favorites) && (
						<div className="box">
							{watched.map(item => (
								<div>{item}</div>
							))}
							{favorites.map(item => (
								<div>{item}</div>
							))}
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	)
}

export default App
