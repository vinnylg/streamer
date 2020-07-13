import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import Button from './Button'

import '../styles/sidenav.css'

const SideMenu = ({ open, toogleNav, items, width }) => {
	const location = useLocation()
	const [listItems, setListItems] = useState(null)
	const [currentItem, setCurrentItem] = useState(null)

	useEffect(() => {
		setListItems(
			items.map(item => {
				if (item.path === location.pathname) {
					setCurrentItem(item)
					return (
						<Button id={item.id} key={item.id} to={item.path} active={true}>
							{item.name}
						</Button>
					)
				} else {
					return (
						<Button key={item.id} to={item.path}>
							{item.name}
						</Button>
					)
				}
			})
		)
	}, [location, items])

	useEffect(() => {
		if (open && currentItem && currentItem.path === location.pathname) {
			let e = document.getElementById(currentItem.id)
			if (e)
				e.scrollIntoView({
					block: 'center'
				})
		}
	}, [listItems, open, currentItem, location])

	return (
		open && (
			<div className="sidebar" style={{ width }}>
				<div className="sidebar-content">{listItems}</div>
			</div>
		)
	)
}

export default SideMenu
