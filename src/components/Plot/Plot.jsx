import React, { useEffect, useState } from 'react';
import style from './Plot.module.scss'
import { VictoryChart, VictoryLine, VictoryScatter } from 'victory';
import { COLORS } from './colors.js'

const cartesianInterpolations = [
    "Linear",
    "Natural"
];

function InterpolationSelect ({ currentValue, values, onChange }) {

    return <select onChange={onChange} value={currentValue} style={{ width: 75 }}>

        { values.map(value => <option value={value} key={value}>{value}</option>) }

    </select>

};

function Plot({ data }) {

    const [interpolation, setInterpolation] = useState('linear');
    const [colors, setColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState('#059669');

    useEffect(() => {

        setColors(Object.keys(COLORS).map(colorName => COLORS[colorName]));
        
    }, [])

    return (
        <div className={style.Plot}>

            <div className={style.Select}>

                <InterpolationSelect
                    currentValue={interpolation}
                    values={cartesianInterpolations}
                    onChange={event => setInterpolation(event.target.value)}
                />

            </div>

            <div className={style.Chart}>

                <VictoryChart>

                    <VictoryLine
                        interpolation={interpolation} data={data}
                        style={{ data: { stroke: selectedColor } }}
                    />
                    <VictoryScatter data={data}
                        size={5}
                        style={{ data: { fill: selectedColor } }}
                    />

                </VictoryChart>

            </div>

            <div className={style.Colors}>

                {renderColorButtons(colors)}

            </div>

        </div>
    )

    function renderColorButton(color) {

        return <div
            className={style.Color}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
        > </div>

    }

    function renderColorButtons(colors) {

        return <div className={style.Colors}>

            {colors.map(color => renderColorButton(color))}

        </div>

    }

}

export default Plot;

