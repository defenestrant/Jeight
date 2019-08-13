import React, { useState, useEffect, useRef, useLayoutEffect } from "react"
import styled from "styled-components"
import { Cross, Arrow } from "./Fancy"
import * as R from "ramda"
import { useDebounce } from "./hooks"
import Checkers from "./Checkers"
import { generateTwoHighContrastRandomColors } from "../logic/utils"

const isStringHexColor = color => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)



const MarginedArrow = styled(Arrow)`
    margin: 10px;
`


const Settings = ({ settings, onChangeSettings, onResetSettings }) => {

    console.log("settings render", settings)

    const [displayColorErr, setDisplayColorErr] = useState(false)
    const [displaySameColorErr, setDisplaySameColorErr] = useState(false)

    const [layout, setLayout] = useState({
        displayBumpersAndTriggers: settings.displayBumpersAndTriggers,
        displayRightThumbButtons: settings.displayRightThumbButtons
    })

    const [primaryColor, setPrimaryColor] = useState(settings.primaryColor)
    const [secondaryColor, setSecondaryColor] = useState(settings.secondaryColor)
    const [additions, setAdditions] = useState(settings.additions)
    const [language, setLanguage] = useState(settings.language)
    const [gamepadType, setGamepadType] = useState(settings.gamepadType)

    const firstUpdate = useRef(true)

    const showColorErr = () => setDisplayColorErr(true)
    const hideColorErr = () => setDisplayColorErr(false)
    const showSameColorErr = () => setDisplaySameColorErr(true)
    const hideSameColorErr = () => setDisplaySameColorErr(false)

    const debouncedSettings = useDebounce([additions, layout, language, gamepadType], 1000)


    useEffect(() => {

        if(firstUpdate.current)
        {
            firstUpdate.current = false
            return
        }

        onChangeSettings({
            displayBumpersAndTriggers: layout.displayBumpersAndTriggers,
            displayRightThumbButtons: layout.displayRightThumbButtons,
            primaryColor,
            secondaryColor,
            additions,
            language,
            gamepadType
        })

    }, [debouncedSettings])

    useEffect(() => {
        onChangeSettings({
            displayBumpersAndTriggers: layout.displayBumpersAndTriggers,
            displayRightThumbButtons: layout.displayRightThumbButtons,
            primaryColor,
            secondaryColor,
            additions,
            language,
            gamepadType
        })
    }, [primaryColor, secondaryColor])


    const onChangeLayout = val => {
        setLayout(l => ({...l, [val]: !l[val]}))
    }

    const onChangeColor = (colorSetter, otherColor) => e =>
    {
        const color = e.target.value
        if(!isStringHexColor(color))
        {
            showColorErr()
            return
        }

        if(color == otherColor)
        {
            showSameColorErr()
            return
        }

        hideSameColorErr()
        hideColorErr()

        colorSetter(color)

    }

    const switchColors = () => {

        setPrimaryColor(secondaryColor)
        setSecondaryColor(primaryColor)

        hideSameColorErr()
        hideColorErr()

        onChangeSettings({
            ...settings,
            primaryColor: secondaryColor,
            secondaryColor: primaryColor
        })
    }

    const randomizeColors = () => {

        const [randomPrimaryColor, randomSecondaryColor] = generateTwoHighContrastRandomColors()
        setPrimaryColor(randomPrimaryColor)
        setSecondaryColor(randomSecondaryColor)

        hideSameColorErr()
        hideColorErr()

        onChangeSettings({
            ...settings,
            primaryColor: randomPrimaryColor,
            secondaryColor: randomSecondaryColor
        })
    }

    const onChangeAdditions = e => {
        setAdditions(e.target.value)
    }

    return (
        <SettingsContainer>
            <SettingsArea>
                <h3>Your own additions to the dictionary</h3>
                <CustomTextArea value={additions} onChange={onChangeAdditions} />
            </SettingsArea>
            <SettingsArea>
                <h3>Dictionary Language</h3>
                <Checkers items={[
                    {
                        val: "en",
                        selected: language == "en",
                        label: "English"
                    },
                    {
                        val: "nl",
                        selected: language == "nl",
                        label: "Dutch"
                    }
                ]}
                onChange={setLanguage} />

            </SettingsArea>
            <SettingsArea>
                <h3>Gamepad Type</h3>
                <Checkers items={[
                    {
                        val: "ps",
                        selected: gamepadType == "ps",
                        label: "Playstation"
                    },
                    {
                        val: "xbox",
                        selected: gamepadType == "xbox",
                        label: "Xbox"
                    }
                ]}
                onChange={setGamepadType} />
            </SettingsArea>
            <SettingsArea>
                <h3>Jeight Keyboard Layout</h3>
                <Checkers items={[
                    {
                        val: "displayBumpersAndTriggers",
                        selected: layout.displayBumpersAndTriggers,
                        label: "Display bumpers-and-triggers-help"
                    },
                    {
                        val: "displayRightThumbButtons",
                        selected: layout.displayRightThumbButtons,
                        label: "Display right-thumb-buttons-help"
                    }
                ]} onChange={onChangeLayout}/>
            </SettingsArea>
            <SettingsArea>
                <h3>Colors</h3>
                <ColorFlex>
                    <ColorGrid>
                        <div>Background Color</div>
                        <CustomInput value={primaryColor} onChange={onChangeColor(setPrimaryColor, secondaryColor)} />
                        <div>Highlight Color</div>
                        <CustomInput value={secondaryColor} onChange={onChangeColor(setSecondaryColor, primaryColor)} />
                    </ColorGrid>
                    <PointerDiv onClick={switchColors}>
                        <MarginedArrow direction={0} />
                        <MarginedArrow direction={2} />
                    </PointerDiv>
                    <PointerDiv onClick={switchColors}>Switch Colors</PointerDiv>
                </ColorFlex>
                <RandomizeColors onClick={randomizeColors}>Randomize colors</RandomizeColors>
                <div>{displayColorErr && <>Please copy paste the hex-value of your desired color</>}</div>
                <div>{displaySameColorErr && <>That doesn't seem like the most brightest of ideas, doesn't it?</>}</div>
            </SettingsArea>
            <SaveButton onClick={onResetSettings}>Reset to defaults</SaveButton>
        </SettingsContainer>
    )
}

const SettingsContainer = styled.div`
    margin: 100px;
`





const SettingsArea = styled.div`
    margin: 100px 0;
`

const ColorFlex = styled.div`
    display: flex;
    align-items: center;
`

const ColorGrid = styled.div`
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 200px 200px;
    align-items: center;
`

const CustomInput = styled.input`
    background: ${p => p.theme.primaryColor};
    color: ${p => p.theme.secondaryColor};
    border: 1px solid ${p => p.theme.secondaryColor};
    padding: 10px;
    margin: 15px;
    font-family: "Avenir Next";
    box-sizing: border-box;
    cursor: text;

    :focus
    {
        outline: 0;
    }
`

const CustomTextArea = styled.textarea`
    background: ${p => p.theme.primaryColor};
    color: ${p => p.theme.secondaryColor};
    border: 1px solid ${p => p.theme.secondaryColor};
    padding: 10px;
    font-family: "Avenir Next";
    box-sizing: border-box;
    cursor: text;
    width: 100%;
    max-width: 100%;
    height: 200px;
    font-size: 11pt;
    font-weight: 100;

    :focus
    {
        outline: 0;
    }
`


const ColorSwitchContainer = styled.div`
    margin-left: 20px;
`

const SaveButton = styled.div`
    background: ${p => p.theme.primaryColor};
    color: ${p => p.theme.secondaryColor};
    border-bottom: 1px solid ${p => p.theme.secondaryColor};
    padding: 10px;
    margin: 20px;
    font-family: "Avenir Next";
    font-size: 12pt;
    cursor: pointer;
    width: auto;

    :focus
    {
        outline: 0;
    }

    :hover
    {
        border-bottom: 2px solid ${p => p.theme.secondaryColor};
    }
`

const PointerDiv = styled.div`
    cursor: pointer;
`

const RandomizeColors = styled(PointerDiv)`
    margin-top: 20px;

    :hover
    {
        text-decoration: underline;
    }
`

export default Settings
