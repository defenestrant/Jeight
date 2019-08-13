import React from "react"
import styled from "styled-components"

import { brightColor, darkColor } from "../constants"

import arrowSvg from "../assets/arrow.svg"
import arrowActiveSvg from "../assets/arrowActive.svg"
import bumperSvg from "../assets/bumper.svg"
import bumperActiveSvg from "../assets/bumperActive.svg"
import triggerSvg from "../assets/trigger.svg"
import triggerActiveSvg from "../assets/triggerActive.svg"
import circlerSvg from "../assets/circler.svg"
import circlerActiveSvg from "../assets/circlerActive.svg"
import innerCircleSvg from "../assets/innerCircle.svg"
import innerCircleActiveSvg from "../assets/innerCircleActive.svg"
import crossSvg from "../assets/cross.svg"
import crossActiveSvg from "../assets/crossActive.svg"
import triangleSvg from "../assets/triangle.svg"
import triangleActiveSvg from "../assets/triangleActive.svg"


// BEGIN Fancy Vertical Lign
export const VerticalLign = styled.div`
    position: relative;
    background: ${p => p.theme.secondaryColor};
    width: 1px;
    height: ${p => p.height};
`

const LittleBol = styled.div`
    background: ${p => p.theme.secondaryColor};
    width: 5px;
    height: 5px;
    border-radius: 50%;
`

const VerticalLignContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
`

export const FancyVerticalLign = ({ height }) => (
    <VerticalLignContainer>
        <LittleBol />
        <VerticalLign height={height} />
        <LittleBol />
    </VerticalLignContainer>
)
// END Fancy Vertical Lign


export const Arrow = styled.div`
    width: 25px;
    height: 25px;
    background-color: ${p => p.theme.secondaryColor};
    mask: url(${p => p.active ? arrowActiveSvg : arrowSvg}) center center no-repeat;
    transform: rotate(${p => p.direction * 90}deg);
`


// BEGIN Bumper
const BumperContainer = styled.div`
    position: relative;
    width: 50px;
    height: 31px;
`

const BumperSvg = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    background-color: ${p => p.theme.secondaryColor};
    mask: url(${p => p.active ? bumperActiveSvg : bumperSvg}) center center no-repeat;
`

const BumperTextContainer = styled.div`
    position: absolute;
    top: 4px;
    left: 0;
    bottom: 0;
    right: 0;
    text-align: center;
    font-weight: normal;//${p => p.active ? 1000 : 100};
`

export const Bumper = ({children, active}) => (
    <BumperContainer>
        <BumperSvg active={active}/>
        <BumperTextContainer active={active}>{children}</BumperTextContainer>
    </BumperContainer>
)
// END Bumper


// BEGIN Trigger
const TriggerContainer = styled.div`
    position: relative;
    width: 50px;
    height: 42px;
`

const TriggerSvg = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    background-color: ${p => p.theme.secondaryColor};
    mask: url(${p => p.active ? triggerActiveSvg : triggerSvg}) center center no-repeat;
`

const TriggerTextContainer = styled.div`
    position: absolute;
    top: 12px;
    left: 0;
    bottom: 0;
    right: 0;
    text-align: center;
    font-weight: normal;//${p => p.active ? 1000 : 100};
`

export const Trigger = ({children, active}) => (
    <TriggerContainer>
        <TriggerSvg active={active}/>
        <TriggerTextContainer active={active}>{children}</TriggerTextContainer>
    </TriggerContainer>
)
// END Trigger

// BEGIN Circles
const CirclerContainer = styled.div`
    position: relative;
    width: 40px;
    height: 40px;
`

const CirclerSvg = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    background-color: ${p => p.theme.secondaryColor};
    mask: url(${p => p.active ? circlerActiveSvg : circlerSvg}) center center no-repeat;
`

const CirclerIconContainer = styled.div`
    position: absolute;
    top: 12px;
    left: 0;
    bottom: 0;
    right: 0;
`

const Circler = ({children, active}) => (
    <CirclerContainer>
        <CirclerSvg active={active}/>
        {children}
    </CirclerContainer>
)

const CrossSvg = styled.div`
    position: absolute;
    width: 50%;
    height: 50%;
    top: 0;
    transform: translate(50%, 50%);
    background-color: ${p => p.theme.secondaryColor};
    mask: url(${p => p.active ? crossActiveSvg : crossSvg}) center center no-repeat;
    opacity: ${p => p.selected ? 1 : 0};
    transition: opacity 200ms;
`

const InteriorLetter = styled.div`
    position: absolute;
    width: 50%;
    height: 32%;
    top: 0;
    transform: translate(50%,50%);
    text-align: center;
    font-size: 15pt;
    font-weight: normal; //${p => p.active ? "normal": "lighter"};
    color: ${p => p.theme.secondaryColor};
`

export const Cross = ({active, selected = true, gamepadType = "ps"}) => (
    <Circler active={active}>
        {gamepadType == "ps" ? <CrossSvg active={active} selected={selected} /> : <InteriorLetter active={active}>A</InteriorLetter>}
    </Circler>
)

const CircleSvg = styled.div`
    position: absolute;
    width: 50%;
    height: 50%;
    top: 0;
    transform: translate(50%, 50%);
    background-color: ${p => p.theme.secondaryColor};
    mask: url(${p => p.active ? innerCircleActiveSvg : innerCircleSvg}) center center no-repeat;
`

export const Circle = ({active, gamepadType = "ps"}) => (
    <Circler active={active}>
        {gamepadType == "ps" ? <CircleSvg active={active}/> : <InteriorLetter active={active}>B</InteriorLetter>}
    </Circler>
)

const SquareBorder = styled.div`
    position: absolute;
    width: 50%;
    height: 50%;
    top: 0;
    transform: translate(50%, 50%);
    border: ${p => p.active ? "2" : "1"}px solid ${p => p.theme.secondaryColor};
    box-sizing: border-box;
`

export const Square = ({active, gamepadType = "ps"}) => (
    <Circler active={active}>
        {gamepadType == "ps" ? <SquareBorder active={active}/> : <InteriorLetter active={active}>C</InteriorLetter>}
    </Circler>
)

const TriangleSvg = styled.div`
    position: absolute;
    width: 50%;
    height: 50%;
    top: -2px;
    transform: translate(50%, 50%);
    background-color: ${p => p.theme.secondaryColor};
    mask: url(${p => p.active ? triangleActiveSvg : triangleSvg}) center center no-repeat;
`

export const Triangle = ({active, gamepadType = "ps"}) => (
    <Circler active={active}>
        {gamepadType == "ps" ? <TriangleSvg active={active}/> : <InteriorLetter active={active}>D</InteriorLetter>}
    </Circler>
)