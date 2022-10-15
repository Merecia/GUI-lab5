import React from 'react'
import Row from './Row/Row'
import style from './Table.module.scss'

const fileContent = localStorage.getItem('fileContent');

function Table ({formula, calculations}) {

    return (
        <div className={style.Table}>

            {fileContent}

            <hr/>

            <p className = {style.Formula}> {formula} </p>

            <table>

                <thead>

                    <tr>
                        <th> X </th>
                        <th> Y </th>
                    </tr>

                </thead>

                <tbody>

                    { renderRows(calculations) }

                </tbody>

            </table>

        </div>
    )

}

function renderRows(calculations) {

    return calculations.map(pair => {

        return renderRow({
            x: pair.x,
            y: pair.y
        });

    });

}

function renderRow(row) {

    return (
        <Row
            x = {row.x}
            y = {row.y}
        />
    )

}

export default Table;