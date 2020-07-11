import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import '../styles/header.css'

const Header = ({ toogleNav }) => {
	return (
		<div className="header" position="sticky">
			<IconButton
				edge="start"
				color="inherit"
				aria-label="menu"
				onClick={toogleNav}
			>
				<MenuIcon />
			</IconButton>
		</div>
	)
}

export default Header
