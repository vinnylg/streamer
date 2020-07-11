import React from 'react'

const Video = ({ src, type }) => {
	return (
		src.length > 0 &&
		type.length > 0 && (
			<video id="videoPlayer" controls autoPlay width="80%" height="auto">
				<source src={src} type={type} />
			</video>
		)
	)
}

export default Video
