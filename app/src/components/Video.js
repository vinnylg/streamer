import React, { useEffect, useState } from 'react'
import useEventListener from '@use-it/event-listener'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import Button from './Button'

import history from '../history'
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
		setWatching(0)
		setPrevPath('')
		setNextPath('')

		let videoPlayer = document.getElementById('videoPlayer')
		videoPlayer.src = src
		if (type === 'mkv')
			type = 'mp4'
		videoPlayer.type = type

		axios.get('/watching')
			.then(({ data }) => {
				if (data.watching && data.watching.path === pathname) {
					let time = data.watching.watching
					videoPlayer.currentTime = time
					setWatching(time)
				}
			})

	}, [src, type, pathname])

	useEventListener('loadedmetadata', event => {
		setDuration(event.target.duration)
	}, document.getElementById('videoPlayer'))

	useEventListener('timeupdate', event => {
		setCurrentTime(event.target.currentTime)
	}, document.getElementById('videoPlayer'))

	useEffect(() => {
		let index = items.indexOf(currentItem)
		if (index > 0) setPrevPath(items[index - 1].path)
		if (index < items.length - 1) setNextPath(items[index + 1].path)
	}, [items, currentItem])

	useEffect(() => setCurrentItem(items.find(item => src.includes(item.path))), [
		src,
		items
	])

	const hasWatched = (currentItem) => {
		axios.post('/watched', { currentItem })
			.then(() => {
				setWatch(true)
			})
			.catch(err => console.error(err))
		axios.delete('/watching')
			.then()
			.catch(err => console.error(err))
	}

	useEffect(() => {
		if (!watched) {
			if (currentTime > watching) {
				axios.post('/watching', { currentItem, watching })
					.then(() => setWatching(Math.trunc(currentTime) + 5))
					.catch(err => console.error(err))

				if ((currentTime > 0.95 * duration)) {
					hasWatched(currentItem)
				}
			}
		}
	}, [currentTime, currentItem, duration, watching, watched])


	const toogleLike = () => {
		axios.post('/like', { currentItem })
			.then(({ data }) =>
				setCurrentItem(data.currentItem)
			)
			.catch(err => console.error(err))
	}

	const toNextPath = () => {
		hasWatched(currentItem)
		history.push(nextPath)
	}

	const toPrevPath = () => {
		history.push(prevPath)
	}

	return (
		<div>
			<video id="videoPlayer" controls autoPlay>
				<source src="/" />
			</video>
			<div className="video-controls">
				<Button onClick={toPrevPath}>Prev</Button>
				<Button onClick={toogleLike}>
					{currentItem && !currentItem.liked && '♡'}
					{currentItem && currentItem.liked && '♥'}
				</Button>
				<Button onClick={toNextPath}>Next</Button>
			</div>
		</div>
	)
}

export default Video
