import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

import SideMenu from './components/SideMenu'
import Header from './components/Header'
import Video from './components/Video'
import Button from './components/Button'

import history from './history'

import './styles/app.css'

const videoExt = ['mpg', 'mpeg', 'avi', 'wmv', 'mov', 'ogg', 'webm', 'mp4']

const App = () => {
	const location = useLocation()
	const [windowSize, setWindowSize] = useState({})
	const [open, setOpen] = useState(false)
	const [marginLeft, setMarginLeft] = useState(0)
	const [headerSize, setHeaderSize] = useState(0)
	const [items, setItems] = useState([])
	const [videoPath, setVideoPath] = useState('')
	const [videoType, setVideoType] = useState('')
	const [watched, setWatched] = useState([])
	const [liked, setLiked] = useState([])
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
		if (pathname.includes('.') && videoExt.includes((pathname.split('.')[1]))) {
			setOpen(false)
			setVideoPath('/video?path=' + pathname)
			setVideoType('video/' + pathname.split('.')[1])
			pathname = pathname
				.split('/')
				.filter(part => !part.includes('.'))
				.join('/')
		}
		axios
			.get('/list?path=' + pathname)
			.then(({ data }) => {
				setItems(data.items)
			})
			.catch(err => {
				let parts = pathname.split('/')
				parts.pop()
				history.push(parts.join('/'))
			})
		setOpen(true)
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
		setLiked([])
		if (watched.length > 0)
			setWatched([])
		else
			axios
				.get('/watched')
				.then(({ data }) => {
					const { watched } = data
					watched.forEach(item => {
						let name = item.path.split('.')[0].split('/')
						name[name.length - 1] = 'EPISODE ' + name[name.length - 1]
						name = name.join(' ').replace(/-/g, ' ').toUpperCase()
						item.name = name
					})
					setWatched(watched)
				})
				.catch(err => console.error(err))
	}

	const getLiked = () => {
		setWatched([])
		if (liked.length > 0)
			setLiked([])
		else {
			axios
				.get('/likes')
				.then(({ data }) => {
					const { likes } = data
					likes.forEach(item => {
						let name = item.path.split('.')[0].split('/')
						name[name.length - 1] = 'EPISODE ' + name[name.length - 1]
						name = name.join(' ').replace(/-/g, ' ').toUpperCase()
						item.name = name
					})
					setLiked(likes)
				})
				.catch(err => console.error(err))

		}
	}

	return (
		<React.Fragment>
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
					<div className="box box-row">
						<Button
							onClick={getWatched}
							active={watched.length > 0 ? true : false}
						>
							Assistidos
						</Button>
						<Button
							onClick={getLiked}
							active={liked.length > 0 ? true : false}
						>
							Favoritos
						</Button>
					</div>
					{(watched || liked) && (
						<div className="box">
							{watched.map(item => (
								<Button key={item.id} to={item.path}>{item.name}</Button>
							))}
							{liked.map(item => (
								<Button key={item.id} to={item.path}>{item.name}</Button>
							))}
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	)
}

export default App
