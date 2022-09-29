import React from 'react'
import style from './Button.module.scss'

function Button ( {isActive, children, onClick, color, width, height} ) {
    
    function getClasses() {
 
        const classes = [style.Button]
    
        if (!isActive) classes.push(style.Inactive)

        if (color === 'Blue') classes.push(style.Blue)

        else if (color === 'Purple') classes.push(style.Purple)

        else if (color === 'Green' || color === undefined) classes.push(style.Green)
    
        return classes.join(' ')
    }

    return (
        <button 
            className = { getClasses() } 
            onClick = {isActive ? onClick : null}
            style = {{width, height}}
        >

            {children} 

        </button>
    )
    
}

export default Button