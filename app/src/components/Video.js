import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from './Button'

import '../styles/video.css'

const Video = ({ src, type, items }) => {
	const [currentItem, setCurrentItem] = useState('')
	const [duration, setDuration] = useState(null)
	const [currentTime, setCurrentTime] = useState(null)
	const [prevPath, setPrevPath] = useState('')
	const [nextPath, setNextPath] = useState('')
	const [watched, setWatch] = useState(false)

	useEffect(() => {
		setWatch(false)
		setPrevPath('')
		setNextPath('')
		let videoPlayer = document.getElementById('videoPlayer')
		videoPlayer.src = src
		videoPlayer.type = type
		videoPlayer.load()

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
	}, [src, type])

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
		if (!watched && (currentTime > 0.95 * duration))
			axios.post('/watched', { currentItem })
				.then(({ data }) => {
					setWatch(true)
				})
				.catch(err => console.error(err))
	}, [currentTime, duration, setCurrentItem])

	const setWatchedWhenNext = () => axios.post('/watched', { currentItem })
		.then(({ data }) => {
			setWatch(true)
		})
		.catch(err => console.error(err))


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
				<Button to={nextPath} onClick={setWatchedWhenNext}>Next</Button>
			</div>
		</div>
	)
}

export default Video
