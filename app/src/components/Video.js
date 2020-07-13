import React, { useEffect, useState } from 'react'
import Button from './Button'

import '../styles/video.css'

const Video = ({ src, type, items }) => {
	const [currentItem, setCurrentItem] = useState('')
	const [duration, setDuration] = useState(null)
	const [currentTime, setCurrentTime] = useState(null)
	const [prevPath, setPrevPath] = useState('')
	const [nextPath, setNextPath] = useState('')

	useEffect(() => {
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
		console.log(currentTime)
		console.log(duration)
		//duration===currentTime? finished
		//next -> finished?
	}, [currentTime, duration])

	return (
		<div>
			<video id="videoPlayer" controls autoPlay>
				<source src="/" />
			</video>
			<div className="video-controls">
				<Button to={prevPath}>Prev</Button>
				<Button active={true}>
					<i className="icon-heart-empty" />
				</Button>
				<Button to={nextPath}>Next</Button>
			</div>
		</div>
	)
}

export default Video
