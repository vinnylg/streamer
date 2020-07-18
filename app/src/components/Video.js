import React, { useEffect, useState, useLayoutEffect, useRef } from "react"
import useEventListener from "@use-it/event-listener"
import { useLocation } from "react-router-dom"
import axios from "axios"
import Button from "./Button"

import history from "../history"
import "../styles/video.css"

const Video = ({ src, type, items }) => {
	//const hooks
	const { pathname } = useLocation()

	//const ref
	const videoEl = useRef()
	const nextSecEl = useRef()
	const prevSecEl = useRef()
	const videoControlsEl = useRef()
	const playButtonEl = useRef()
	const seekEl = useRef()
	const seekTooltipEl = useRef()
	// const volumeButtonEl = useRef()
	// const volumeIconsEl = useRef()
	// const volumeMuteEl = useRef()
	// const volumeLowEl = useRef()
	// const volumeHighEl = useRef()
	// const volumeEl = useRef()
	const playbackAnimationEl = useRef()
	const fullscreenButtonEl = useRef()
	const videoContainerEl = useRef()

	//const states values of refs
	const [duration, setDuration] = useState(0)
	const [currentTime, setCurrentTime] = useState(0)
	const [skipTo, setSkipTo] = useState(0)
	const [timeFormated, setTimeFormated] = useState(null)
	const [durationFormated, setDurationFormated] = useState(null)

	//const state
	const [currentItem, setCurrentItem] = useState("")
	const [prevPath, setPrevPath] = useState("")
	const [nextPath, setNextPath] = useState("")
	const [watched, setWatch] = useState(false)
	const [watching, setWatching] = useState(0)

	//useLayoutEffect

	//useEffect
	useLayoutEffect(() => {
		setWatch(false)
		setWatching(0)
		setPrevPath("")
		setNextPath("")
		setDuration(0)
		setDurationFormated(null)
		setCurrentTime(0)
		setTimeFormated(null)
		setSkipTo(null)

		videoEl.current.src = src
		videoEl.current.type = type

		axios.get("/watching").then(({ data }) => {
			if (data.watching && data.watching.path === pathname) {
				let time = data.watching.watching
				videoEl.current.currentTime = time
				setWatching(time)
			}
		})
	}, [src, type, pathname])

	useEffect(() => {
		let index = items.indexOf(currentItem)
		if (index > 0) setPrevPath(items[index - 1].path)
		if (index < items.length - 1) setNextPath(items[index + 1].path)
	}, [items, currentItem])

	useEffect(
		() => setCurrentItem(items.find((item) => src.includes(item.path))),
		[src, items]
	)

	useEffect(() => {
		if (!watched) {
			if (currentTime > watching) {
				axios
					.post("/watching", { currentItem, watching })
					.then(() => setWatching(Math.trunc(currentTime) + 5))
					.catch((err) => console.error(err))

				if (currentTime > 0.95 * duration) {
					hasWatched(currentItem)
				}
			}
		}
	}, [currentTime, currentItem, duration, watching, watched])

	//Functions
	const formatTime = (timeInSeconds) => {
		if (timeInSeconds) {
			const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8)

			return {
				minutes: result.substr(3, 2),
				seconds: result.substr(6, 2),
			}
		} else
			return {
				minutes: 0,
				seconds: 0,
			}
	}

	const initializeVideo = () => {
		let duration = Math.floor(videoEl.current.duration)
		setDuration(duration)
		setDurationFormated(formatTime(duration))
	}

	const updateTime = () => {
		let time = Math.floor(videoEl.current.currentTime)
		setCurrentTime(time)
		setTimeFormated(formatTime(time))
	}

	const updateSeekValue = () => {
		let time = Math.floor(seekEl.current.value)
		setCurrentTime(time)
		videoEl.current.currentTime = time
	}

	const updateSeekTooltip = (event) => {
		const skipTo = Math.round(
			(event.offsetX / event.target.clientWidth) *
				parseInt(event.target.getAttribute("max"), 10)
		)
		setSkipTo(skipTo)
		seekEl.current.setAttribute("data-seek", skipTo)
		const t = formatTime(skipTo)
		seekTooltipEl.current.textContent = `${t.minutes}:${t.seconds}`
		const rect = videoEl.current.getBoundingClientRect()
		seekTooltipEl.current.style.left = `${event.pageX - rect.left}px`
	}

	const togglePlay = () => {
		if (videoEl.current.paused || videoEl.current.ended) {
			videoEl.current.play()
		} else {
			videoEl.current.pause()
		}
		animatePlayback()
	}

	const nextSec = () => {
		videoEl.current.currentTime += 5
		setSkipTo(Math.floor(videoEl.current.currentTime))
	}

	const prevSec = () => {
		videoEl.current.currentTime -= 5
		setSkipTo(Math.floor(videoEl.current.currentTime))
	}

	const updatePlayButton = () => {
		const playbackIcons = document.querySelectorAll(".playback-icons use")
		playbackIcons.forEach((icon) => icon.classList.toggle("hidden"))
	}

	const animatePlayback = () => {
		playbackAnimationEl.current.animate(
			[
				{
					opacity: 1,
					transform: "scale(1)",
				},
				{
					opacity: 0,
					transform: "scale(1.3)",
				},
			],
			{
				duration: 500,
			}
		)
	}

	const toggleFullScreen = () => {
		if (document.fullscreenElement) {
			document.exitFullscreen()
		} else {
			videoContainerEl.current.requestFullscreen()
		}
		const fullscreenIcons = fullscreenButtonEl.current.querySelectorAll("use")
		fullscreenIcons.forEach((icon) => icon.classList.toggle("hidden"))
	}

	const hideControls = () => {
		if (videoEl.current.paused) {
			return
		}

		videoControlsEl.current.classList.add("hide")
	}

	const showControls = () => {
		videoControlsEl.current.classList.remove("hide")
	}

	const hasWatched = (currentItem) => {
		axios
			.post("/watched", { currentItem })
			.then(() => {
				setWatch(true)
			})
			.catch((err) => console.error(err))
		axios
			.delete("/watching")
			.then()
			.catch((err) => console.error(err))
	}

	const toogleLike = () => {
		axios
			.post("/like", { currentItem })
			.then(({ data }) => setCurrentItem(data.currentItem))
			.catch((err) => console.error(err))
	}

	const toNextPath = () => {
		hasWatched(currentItem)
		history.push(nextPath)
	}

	const toPrevPath = () => {
		history.push(prevPath)
	}

	//Listeners
	useEventListener("loadedmetadata", initializeVideo, videoEl.current)
	useEventListener("timeupdate", updateTime, videoEl.current)

	useEventListener("input", updateSeekValue, seekEl.current)

	useEventListener("play", updatePlayButton, videoEl.current)
	useEventListener("pause", updatePlayButton, videoEl.current)

	useEventListener("mouseenter", showControls, videoContainerEl.current)
	useEventListener("mouseleave", hideControls, videoContainerEl.current)

	useEventListener("click", togglePlay, playButtonEl.current)

	useEventListener("mousemove", updateSeekTooltip, seekEl.current)
	useEventListener("mouseleave", () => setSkipTo(currentTime), seekEl.current)

	useEventListener("click", togglePlay, nextSecEl.current)
	useEventListener("click", togglePlay, prevSecEl.current)
	useEventListener("dblclick", nextSec, nextSecEl.current)
	useEventListener("dblclick", prevSec, prevSecEl.current)

	useEventListener("click", toggleFullScreen, fullscreenButtonEl.current)

	return (
		<div>
			<div ref={videoContainerEl} className="video-container">
				<div ref={playbackAnimationEl} className="playback-animation">
					<svg className="playback-icons">
						<use className="hidden" href="#play-icon"></use>
						<use href="#pause"></use>
					</svg>
				</div>
				<div className="inside-controls">
					<div ref={prevSecEl} className="prev-seconds"></div>
					<div ref={nextSecEl} className="next-seconds"></div>
				</div>

				<video ref={videoEl} className="video">
					<source src="/" />
				</video>

				<div ref={videoControlsEl} className="video-controls">
					<div className="video-progress-container">
						<progress
							className="video-progress seek-progress"
							value={skipTo ? skipTo : currentTime}
							max={duration}
						></progress>
						<progress
							className="video-progress"
							value={currentTime}
							max={duration}
						></progress>
						<input
							ref={seekEl}
							className="seek"
							type="range"
							value={currentTime}
							max={duration}
							step="1"
							readOnly
						/>
						<div ref={seekTooltipEl} className="seek-tooltip">
							00:00
						</div>
					</div>
					<div className="bottom-controls">
						<div className="left-controls">
							<button ref={playButtonEl}>
								<svg className="playback-icons">
									<use href="#play-icon"></use>
									<use className="hidden" href="#pause"></use>
								</svg>
							</button>
							<div className="time">
								{timeFormated && (
									<time>
										{timeFormated.minutes}:{timeFormated.seconds}
									</time>
								)}
								{timeFormated && durationFormated && <span> / </span>}
								{durationFormated && (
									<time>
										{durationFormated.minutes}:{durationFormated.seconds}
									</time>
								)}
							</div>
						</div>
						<div className="right-controls">
							<button ref={fullscreenButtonEl} className="fullscreen-button">
								<svg>
									<use href="#fullscreen"></use>
									<use href="#fullscreen-exit" className="hidden"></use>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="my-controls">
				<Button onClick={toPrevPath}>Prev</Button>
				<Button onClick={toogleLike}>
					{currentItem && !currentItem.liked && "♡"}
					{currentItem && currentItem.liked && "♥"}
				</Button>
				<Button onClick={toNextPath}>Next</Button>
			</div>
			<svg style={{ display: "none" }}>
				<defs>
					<symbol id="pause" viewBox="0 0 24 24">
						<path d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path>
					</symbol>

					<symbol id="play-icon" viewBox="0 0 24 24">
						<path d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path>
					</symbol>

					<symbol id="volume-high" viewBox="0 0 24 24">
						<path d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q1.031 0.516 1.758 1.688t0.727 2.344zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path>
					</symbol>

					<symbol id="volume-low" viewBox="0 0 24 24">
						<path d="M5.016 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6zM18.516 12q0 2.766-2.531 4.031v-8.063q1.031 0.516 1.781 1.711t0.75 2.32z"></path>
					</symbol>

					<symbol id="volume-mute" viewBox="0 0 24 24">
						<path d="M12 3.984v4.219l-2.109-2.109zM4.266 3l16.734 16.734-1.266 1.266-2.063-2.063q-1.547 1.313-3.656 1.828v-2.063q1.172-0.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016h-3.984v-6h4.734l-4.734-4.734zM18.984 12q0-2.391-1.383-4.219t-3.586-2.484v-2.063q3.047 0.656 5.016 3.117t1.969 5.648q0 2.203-1.031 4.172l-1.5-1.547q0.516-1.266 0.516-2.625zM16.5 12q0 0.422-0.047 0.609l-2.438-2.438v-2.203q1.031 0.516 1.758 1.688t0.727 2.344z"></path>
					</symbol>

					<symbol id="fullscreen" viewBox="0 0 24 24">
						<path d="M14.016 5.016h4.969v4.969h-1.969v-3h-3v-1.969zM17.016 17.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 9.984v-4.969h4.969v1.969h-3v3h-1.969zM6.984 14.016v3h3v1.969h-4.969v-4.969h1.969z"></path>
					</symbol>

					<symbol id="fullscreen-exit" viewBox="0 0 24 24">
						<path d="M15.984 8.016h3v1.969h-4.969v-4.969h1.969v3zM14.016 18.984v-4.969h4.969v1.969h-3v3h-1.969zM8.016 8.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 15.984v-1.969h4.969v4.969h-1.969v-3h-3z"></path>
					</symbol>

					<symbol id="pip" viewBox="0 0 24 24">
						<path d="M21 19.031v-14.063h-18v14.063h18zM23.016 18.984q0 0.797-0.609 1.406t-1.406 0.609h-18q-0.797 0-1.406-0.609t-0.609-1.406v-14.016q0-0.797 0.609-1.383t1.406-0.586h18q0.797 0 1.406 0.586t0.609 1.383v14.016zM18.984 11.016v6h-7.969v-6h7.969z"></path>
					</symbol>
				</defs>
			</svg>
		</div>
	)
}

export default Video
