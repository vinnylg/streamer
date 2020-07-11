import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/sidenav.css'

const SideMenu = ({ open, toogleNav, items }) => {
	const listItems = items.map(item => (
		<Link className="item" key={item.id} to={item.path.replace('//', '/')}>
			{item.name}
		</Link>
	))
	return (
		open && (
			<div className="sidebar">
				<div className="sidebar-content">{listItems}</div>
			</div>
		)
	)
}

export default SideMenu
