import React from 'react'

import Button from './Button'
import MenuIcon from './MenuIcon'

import '../styles/header.css'

const Header = ({ toogleNav, menuOpen, ...rest }) => {

	return (
		<div {...rest} className="header">
			<MenuIcon onClick={toogleNav} menuOpen={menuOpen} />
		</div>
	)
}

export default Header
