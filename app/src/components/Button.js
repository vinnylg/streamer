import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/button.css'

const Button = ({ onClick, to, children, active, ...rest }) => {
	// console.log(onClick, to, children)
	if (onClick && !active)
		return (
			<button className="button" onClick={onClick} {...rest}>
				{children}
			</button>
		)
	else if (to && !active)
		return (
			<Link className="button" to={to} {...rest}>
				{children}
			</Link>
		)
	else if (active)
		return (
			<div className="button-active" {...rest}>
				{children}
			</div>
		)
	else
		return (
			<div className="button-disable" {...rest}>
				{children}
			</div>
		)
}

export default Button
