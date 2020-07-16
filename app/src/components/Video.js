import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import Button from './Button'

import '../styles/video.css'

const Video = ({ src, type, items }) => {
	const { pathname } = useLocation()
	const [currentItem, setCurrentItem] = useState('')
	const [duration, setDuration] = useState(null)
	const [currentTime, setCurrentTime] = useState(null)
	const [prevPath, setPrevPath] = useState('')
	const [nextPath, setNextPath] = useState('')
	const [watched, setWatch] = useState(false)
	const [watching, setWatching] = useState(0)

	useEffect(() => {
		setWatch(false)
		setWatching(5)
		setPrevPath('')
		setNextPath('')

		let videoPlayer = document.getElementById('videoPlayer')
		videoPlayer.src = src
		videoPlayer.type = type

		axios.get('/watching')
			.then(({ data }) => {
				if (data.watching && data.watching.path === pathname) {
					let time = data.watching.watching
					videoPlayer.currentTime = time
				}
			})

		videoPlayer.addEventListener('loadedmetadata', event => {
			setDuration(event.target.duration)
		})

		videoPlayer.addEventListener('timeupdate', event => {
			setCurrentTime(event.target.currentTime)
		})

		return () => {
			let videoPlayer = document.getElementById('videoPlayer')
			videoPlayer.removeEventListener('timeupdate', event => {
				setCurrentTime(event.target.currentTime)
			})
			videoPlayer.removeEventListener('loadedmetadata', event => {
				setDuration(event.target.duration)
			})
		}
	}, [src, type, pathname])

	useEffect(() => {
		let index = items.indexOf(currentItem)
		if (index > 0) setPrevPath(items[index - 1].path)
		if (index < items.length - 1) setNextPath(items[index + 1].path)
	}, [items, currentItem])

	useEffect(() => setCurrentItem(items.find(item => src.includes(item.path))), [
		src,
		items
	])

	useEffect(() => {
		if (!watched && currentTime > watching) {
			axios.post('/watching', { currentItem, watching })
				.then(() => setWatching(prev => prev + 5))
				.catch(err => console.error(err))
		}
		if (!watched && (currentTime > watching) && (currentTime > 0.95 * duration)) {
			axios.post('/watched', { currentItem })
				.then(() => {
					setWatch(true)
				})
				.catch(err => console.error(err))
			axios.delete('/watching')
				.catch(err => console.error(err))
		}
	}, [currentTime, currentItem, duration, watching, watched])


	const toogleLike = () => {
		axios.post('/like', { currentItem })
			.then(({ data }) =>
				setCurrentItem(data.currentItem)
			)
			.catch(err => console.error(err))
	}

	return (
		<div>
			<video id="videoPlayer" controls autoPlay>
				<source src="/" />
			</video>
			<div className="video-controls">
				<Button to={prevPath}>Prev</Button>
				<Button onClick={toogleLike}>
					{currentItem && !currentItem.liked && '♡'}
					{currentItem && currentItem.liked && '♥'}
				</Button>
				<Button to={nextPath}>Next</Button>
			</div>
		</div>
	)
}

export default Video
