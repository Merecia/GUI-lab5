import React from 'react';
import style from './Popup.module.scss';

function Popup({text, handleClose}) {

    return (
        <div className={style.Popup}>

            <div className={style.Box}>

                <span className={style.CloseIcon} onClick={handleClose}> x </span>

                <div className = {style.Content}>

                    {text} 

                </div>

            </div>

        </div>
    )

}

export default Popup;