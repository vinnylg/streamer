import React, { useEffect } from 'react'

import '../styles/menuicon.css'

const MenuIcon = ({ onClick, menuOpen }) => {
	useEffect(() => {
		let e = document.getElementById('menu-button')
		if (menuOpen) e.classList.add('change')
		else e.classList.remove('change')
	}, [menuOpen])

	return (
		<div id="menu-button" className="container" onClick={onClick}>
			<div className="bar1"></div>
			<div className="bar2"></div>
			<div className="bar3"></div>
		</div>
	)
}

export default MenuIcon
