import React, { useEffect } from 'react'

const Video = ({ src, type }) => {
	useEffect(() => {
		let videoPlayer = document.getElementById('videoPlayer')
		videoPlayer.src = src
		videoPlayer.type = type
		videoPlayer.load()
	}, [src, type])

	return (
		<video id="videoPlayer" controls autoPlay>
			<source />
		</video>
	)
}

export default Video
