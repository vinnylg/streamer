import React from 'react'
import '../styles/button.css'

const Button = ({ children, ...rest }) => {
	return <button {...rest}>{children}</button>
}

export default Button
