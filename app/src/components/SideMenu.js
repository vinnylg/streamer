import React, { useState, useEffect } from 'react'
import Link from '@material-ui/core/Link'
import '../styles/sidenav.css'

const SideMenu = ({ open, toogleNav }) => {
	return (
		open && (
			<div className="sidebar">
				<div className="sidebar-content"></div>
			</div>
		)
	)
}

export default SideMenu
