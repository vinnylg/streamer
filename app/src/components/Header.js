import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import Button from './Button'
import MenuIcon from './MenuIcon'

import '../styles/header.css'

const Header = ({ toogleNav, menuOpen }) => {
	const location = useLocation()
	const [breadscumb, setBreadscumbs] = useState(null)

	useEffect(() => {
		let pathname = location.pathname
		let pathParts = pathname !== '/' ? pathname.split('/') : ['']
		let breads = []

		for (let i = 0; i < pathParts.length; i++) {
			let path = ''
			let name = ''
			let active = false
			for (let j = 0; j <= i; j++) {
				path = path === '/' ? path + pathParts[j] : path + '/' + pathParts[j]
				if (j === i) name = pathParts[j].replace('-', ' ').toUpperCase()
				if (j === i && path === '/') name = 'HOME'
			}
			if (i === pathParts.length - 1) active = true
			if (name.includes('.'))
				name = 'EPISODE ' + name.split('.')[0].replace(/^0+/, '')
			breads.push({ name, path, active })
		}

		setBreadscumbs(
			breads.map(item => (
				<Button key={'breads-' + item.name} to={item.path} active={item.active}>
					{item.name}
				</Button>
			))
		)
	}, [location])

	return (
		<div className="header" position="sticky">
			<MenuIcon onClick={toogleNav} menuOpen={menuOpen} />
			<div className="breadscumb">{breadscumb}</div>
		</div>
	)
}

export default Header
