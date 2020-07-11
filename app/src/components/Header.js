import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
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
