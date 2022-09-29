import React from 'react'
import style from './Input.module.scss'

function Input( {placeholder, label, onKeyPress, onChange, value, width, height} ) {

    return (
        <div className = {style.Input}>

            <p> {label} </p>

            <input 
                type="text" 
                placeholder = {placeholder} 
                value = {value} 
                onChange = {onChange} 
                style = {{width, height}}
                onKeyPress = {onKeyPress}
            />

        </div>
    )

}

export default Input