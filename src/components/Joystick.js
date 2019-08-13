import * as R from "ramda"
import React, { useState, useEffect } from "react"
import { pure } from "recompose"
import styled from "styled-components"

import smallJoyDirPng from "../assets/smallJoyDir.png"
import smallJoyDirSvg from "../assets/smallJoyDir.svg"
import bigJoyDirSvg from "../assets/bigJoyDir.svg"
import bigJoyDirActiveSvg from "../assets/bigJoyDir-active.svg"

import { brightColor } from "../constants"

import { percentageToDegrees } from "../logic/trigon"

console.log(bigJoyDirSvg)


// horizontalSizes -> dir -> [x, y]
let getSizes = horizontalSizes =>
    ( R.ifElse )
    ( R.either(R.equals(0), R.equals(2)) )
    ( R.always(horizontalSizes) )
    ( R.always(R.reverse(horizontalSizes)) )

const horizontalSizes = [150, 68]
getSizes = getSizes(horizontalSizes)

const threeTopPositions = [
    [23, 55],
    [50, 44],
    [77, 55]
]

const fourTopPositions = [
    [23, 55],
    [40, 40],
    [60, 40],
    [77, 55]
]

const distance = 100;

// rotation, top, left
const dirMap = [
    [0, -distance, 0],
    [90, 0, distance],
    [180, distance, 0],
    [270, 0, -distance]
]

const mapWithIndex = R.addIndex(R.map)

const JoyDir = React.memo(({ dir, characters, active, upperCase }) =>
{
    const positions = R.length(characters) == 3 ? threeTopPositions : fourTopPositions
    const positionsJsx = mapWithIndex((c, i) => <Pos key={c} activeDir={dir} pos={positions[i]} active={active} upperCase={upperCase}>{c}</Pos>)(characters)

    return (
        <JoyDirContainer activeDir={dir}>
            <JoyDirImg active={active} />
            {positionsJsx}
        </JoyDirContainer>
    )
})


const charMapToJoyDirs = (activeDir, upperCase) => (c, i) => <JoyDir key={c} dir={i} active={i == activeDir} characters={c} upperCase={upperCase}/>

const Rotator = React.memo(({ angle, dir: activeDir }) => (
    <PointerRotator angle={angle} activeDir={activeDir}>
        <PointerContainer>
            <SmallJoyDirImg />
        </PointerContainer>
    </PointerRotator>
))

const Joystick = React.memo(({ chars, activeDir, angle, upperCase }) =>
{
    const joyDirsJsx = chars.map(charMapToJoyDirs(activeDir, upperCase))

    return (
        <Container>
            <JoyDirPositioner>
                <CenterCircle />
                <Rotator angle={angle} dir={activeDir}/>
                {joyDirsJsx}
            </JoyDirPositioner>
        </Container>
    )
})

export default Joystick

const Container = styled.div`
    position: relative;
    width: 350px;
    height: 300px;
    margin: 0 35px;
`

const ContainerCenter = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    height: 5px;
    width: 5px;
    transform: translate(-50%, -50%);
    background: red;
`

const JoyDirPositioner = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
`

const JoyDirContainer = styled.div`
    position: absolute;
    width: 150px;
    height: 68px;
    transform-origin: center center;
    transform: translate(-50%, -50%) rotate(${p => dirMap[p.activeDir][0]}deg);
    top: ${p => dirMap[p.activeDir][1]}px;
    left: ${p => dirMap[p.activeDir][2]}px;
`

const JoyDirImg = styled.div`
    width: 100%;
    height: 100%;
    background-color: ${p => p.theme.secondaryColor};
    mask: url(${p => p.active ? bigJoyDirActiveSvg : bigJoyDirSvg}) center center no-repeat;
`

const SmallJoyDirImg = styled(JoyDirImg)`
    mask: url(${smallJoyDirPng}) center center no-repeat;
`

const Pos = styled.div.attrs(({active}) => ({
    style: {
        "fontWeight": active ? "bold" : "normal"
    }
}))`
    color: ${p => p.theme.secondaryColor};
    position: absolute;
    left: ${p => p.pos[0]}%; //x
    top: ${p => p.pos[1]}%; //y
    font-size: 15pt;
    text-transform: ${p => p.upperCase ? "uppercase" : "lowercase"};

    transform: translate(-50%,-50%) rotate(-${p => dirMap[p.activeDir][0]}deg);
`

const CenterCircle = styled.div`
    position: absolute;
    width: 15px;
    height: 15px;
    border: 1px solid ${p => p.theme.secondaryColor};
    border-radius: 50%;
    transform: translate(-50%, -50%);
`


const PointerRotator = styled.div.attrs(({angle, activeDir}) => ({
    style: {
        transform: `rotate(${angle + 90}deg)`,
        opacity: activeDir == -1 ? 0 : 1
    }
}))`
    position: absolute;
    transform-origin: top left;
    transition: opacity 200ms;
`

const PointerContainer = styled.div`
    position: relative;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 27px;
    top: -38px;
`

