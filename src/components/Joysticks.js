

import React, { useState, useEffect } from "react"
import styled from "styled-components"

// Components
import Joystick from "./Joystick"
import { FancyVerticalLign, Arrow, Bumper, Trigger, Cross, Circle, Square, Triangle } from "./Fancy"
import tempfingersPng from "../assets/tempfingers.png"

// Config
import { brightColor, darkColor, keyCodes } from "../constants"
import { alphabet } from "../config"

// Logic
import * as R from "ramda"
import { subscribeToGamepadData, deadzoneOnAllJoystickProps, isButtonDown, isButtonUp, didButtonGoDown, didButtonGoUp, findJoysticksDirections, analyzeDirections, didTriggerGoUp } from "../logic/controller"
import { alignCases, alignPhraseCasing, cutPhrase, phraseToStr, changeWordAtCursor, backSpaceInPhrase, backSpaceWordInPhrase } from "../logic/phrase"
import { newSentenceWithWord, newPhraseWithWord } from "../logic/prediction"
import wordToJoyDirStr, { convertArrToStr, getWordsByJoyDirStr, getOtherWordsOrChars, punctuations, isCharPunctuation, wordsForJoyDirStr, getFollowedByWord } from "../logic/t9"
import { thetaInPercentage, thetaInDegrees } from "../logic/trigon";
import safeWordToJoyDirStr from "../logic/t9";
import { useDebounce } from "./hooks";

const defaultToEmptyObject = R.defaultTo({})

const leftAlphabet = R.take(4)(alphabet)
const rightAlphabet = R.takeLast(4)(alphabet)

// obj -> value
const keyCodeFromEvent = R.prop("keyCode")

const trace = R.tap(console.log)

// currIndex -> listLength -> nextIndex
const nextIndexOnRoundTrip = R.curry((currIndex, listLength) => currIndex < listLength - 1 ? currIndex + 1 : 0)
const prevIndexOnRoundTrip = R.curry((currIndex, listLength) => listLength == 0 ? 0 : currIndex == 0 ? listLength - 1 : currIndex - 1)

// currIndex -> [item] -> item
const nextItemOnRoundTrip =
    ( R.curry )
    ( ( currPuncIndex, punctuations) =>
      ( R.nth )
      ( ( nextIndexOnRoundTrip )
        ( currPuncIndex )
        ( R.length(punctuations) )
      )
      ( punctuations )
    )


const wordToJsx = R.cond([
    [R.equals("↲"), R.always(<br/>)],
    [R.T, w => <span style={{float: "left", textDecoration: "inherit"}}>{w}</span>]
])


// // possibleWords -> j8index -> word
// const getJ8dWord = possibleWords => j8index => possibleWords.length == 0 ? null : possibleWords[j8index]


const defaultToEmptyStr = R.defaultTo("")

const DEBUG_nothingJorDirStr = "R0R0R2L2L2R0L2"


    

export default ({ joyDirStrMap, languageBaseDocmap, additionsBaseDocmap, settings, savedText, saveText }) => {

    //console.log(languageBaseDocmap, additionsBaseDocmap, settings)

    if(languageBaseDocmap == null)
        return <HorizontalCenter>
            <NoDetectedContainer>
                <NoDetectedMain>Loading dictionary.</NoDetectedMain>
            </NoDetectedContainer>
        </HorizontalCenter>

    const baseDocmaps = [additionsBaseDocmap, languageBaseDocmap]
    window.baseDocmaps = baseDocmaps

    const [ gamepadData, setGamepadData ] = useState(null)
    const [ ready, setReady ] = useState(false)
    const [ text, setText ] = useState(savedText)
    const [ j8Index, setJ8Index ] = useState(0)
    const { phrase, casing } = text
    const [ cursorPosition, setCursorPosition ] = useState(phrase.length == 0 ? 0 : phrase.length - 1)
    const [ leftAngle, setLeftAngle ] = useState(null)
    const [ rightAngle, setRightAngle ] = useState(null)
    const [ choosingNextWord, setChoosingNextWord ] = useState(false)
    const [ upperCase, setUpperCase ] = useState(false)


    const debouncedText = useDebounce([text], 1000)

    useEffect(() => {
        saveText(text)
    }, [debouncedText])

    const startsChoosingNextWord = () => setChoosingNextWord(true)
    const endsChoosingNextWord = () => 
    {
        const word = R.nth(j8Index, foundWords)

        if(word == null || word == "")
            return 

        const phraseWithSpace = R.insert(cursorPosition + 1)(" ")(phrase)
        const casingWithSpace = R.insert(cursorPosition + 1)("l")(casing)

        setText({
            phrase: changeWordAtCursor(cursorPosition + 2)(word)(phraseWithSpace),
            casing: changeWordAtCursor(cursorPosition + 2)(R.map(R.always("l"))(word))(casingWithSpace)
        })

        setCursorPosition(R.add(2))
        setChoosingNextWord(false)
        setJ8Index(0)
    }

    const wordAtCursor = R.nth(cursorPosition)(phrase)
    const casesAtCursor = defaultToEmptyStr(R.nth(cursorPosition)(casing))
    const upCasesLikeWordAtCursor = alignCases(casesAtCursor)

    const reallyChoosingNextWord = choosingNextWord && wordAtCursor != null && wordAtCursor != ""

    let foundWords = []
    if(reallyChoosingNextWord)
        foundWords = getFollowedByWord(wordAtCursor)(baseDocmaps)
    else
        foundWords = getOtherWordsOrChars(baseDocmaps)(wordAtCursor)
    //console.log("foundwords", foundWords)

    const previousJ8Index = prevIndexOnRoundTrip(j8Index, foundWords.length)
    const nextJ8Index = nextIndexOnRoundTrip(j8Index, foundWords.length)

    const casedPhrase = alignPhraseCasing(phrase)(casing)
    //console.log(casedPhrase)
    const jsxdPhrase = R.map(wordToJsx)(casedPhrase)
    const cuttedCasedPhrase = cutPhrase(cursorPosition)(jsxdPhrase)

    const resetJ8Index = () => setJ8Index(0)
    const nextJ8InPhrase = () =>
    {
        if(foundWords.length == 0)
            return

        const word = R.nth(nextJ8Index, foundWords)
        setText(text => ({
            ...text,
            phrase: changeWordAtCursor(cursorPosition)(word)(text.phrase),
        }))
        setJ8Index(nextJ8Index)
    }

    const previousJ8InPhrase = () =>
    {
        if(foundWords.length == 0)
            return

        const word = R.nth(previousJ8Index, foundWords)
        setText(text => ({
            ...text,
            phrase: changeWordAtCursor(cursorPosition)(word)(text.phrase)
        }))
        setJ8Index(previousJ8Index)
    }

    const nextNextWord = () => 
    {
        if(foundWords.length == 0)
            return

        setJ8Index(nextJ8Index)
    }

    const previousNextWord = () =>
    {
        if(foundWords.length == 0)
            return

        setJ8Index(previousJ8Index)
    }

    const moveCursorLeft = () =>
    {
        if(cursorPosition != 0)
        {
            setCursorPosition(cursorPosition - 1)
            resetJ8Index()
        }
    }

    const moveCursorRight = () =>
    {
        if(cursorPosition != phrase.length - 1)
        {
            setCursorPosition(cursorPosition + 1)
            resetJ8Index()
        }
    }

    const onBackSpace = () =>
    {
        const backspaceInPhraseAtCursor = backSpaceInPhrase(cursorPosition)
        const newPhrase = backspaceInPhraseAtCursor(phrase)
        const newCasing = backspaceInPhraseAtCursor(casing)

        resetJ8Index()
        setText({
            phrase: newPhrase,
            casing: newCasing
        })

        if(newPhrase.length != phrase.length)
            moveCursorLeft()
    }


    const onBackspaceWord = () =>
    {
        const { newPhrase, newCasing } = backSpaceWordInPhrase(cursorPosition)({phrase, casing})

        resetJ8Index()
        setText({
            phrase: newPhrase,
            casing: newCasing
        })

        const phraseLengthDelta = phrase.length - newPhrase.length
        console.log("phraseLengthDelta", phraseLengthDelta)

        const amountCursorToLeft = cursorPosition - phraseLengthDelta < 0 ? 0 : cursorPosition - phraseLengthDelta

        setCursorPosition(amountCursorToLeft)
        resetJ8Index()
        
            
    }

    const addJoyDir = R.curry((upperCase, joyDir) =>
    {
        const joyDirStrAtCursor = wordToJoyDirStr(wordAtCursor)
        const newJoyDirStr = joyDirStrAtCursor + joyDir
        const foundWords = getWordsByJoyDirStr(newJoyDirStr, baseDocmaps)
        const word = R.nth(0, foundWords)
        const newCase = upperCase === true ? "u" : "l"

        if(word == null)
            return

        if(word == wordAtCursor)
            return

        if(wordAtCursor == " " || isCharPunctuation(wordAtCursor) || wordAtCursor == "↲")
        {
            setText(text => ({
                phrase: R.insert(cursorPosition + 1)(word)(text.phrase),
                casing: R.insert(cursorPosition + 1)(newCase)(text.casing)
            }))

            setCursorPosition(R.add(1))
        }
        else
        {
            setText(text => ({
                phrase: changeWordAtCursor(cursorPosition)(word)(text.phrase),
                casing: changeWordAtCursor(cursorPosition)(casesAtCursor + newCase)(text.casing)
            }))
        }

        resetJ8Index()
    })

    const addSpace = () =>
    {
        setText(text => ({
            phrase: R.insert(cursorPosition + 1)(" ")(text.phrase),
            casing: R.insert(cursorPosition + 1)("l")(text.casing)
        }))
        setCursorPosition(R.add(1))
    }

    const addSpecialCharacter = () =>
    {
        resetJ8Index()
        const newphrase = R.insert(cursorPosition + 1)(R.nth(0, punctuations))(text.phrase)
        console.log("phrase", phrase)
        console.log("newphrase", newphrase)

        setText(text => ({
            ...text,
            phrase: newphrase,
            casing: R.insert(cursorPosition + 1)("l")(text.casing)
        }))
        setCursorPosition(R.add(1))
    }

    const addEnter = () =>
    {
        setText(text => ({
            phrase: R.insert(cursorPosition + 1)("↲")(text.phrase),
            casing: R.insert(cursorPosition + 1)("l")(text.casing)
        }))
        setCursorPosition(R.add(1))
    }

    const gamepadDataListener = gamepadData =>
    {
        if(gamepadData == null)
            return

        const { prev, curr } = gamepadData

        if(prev == null || curr == null)
            return

        setGamepadData({prev, curr})

        const isButtonDownNow = isButtonDown(R.__, curr)
        const isButtonUpNow = isButtonUp(R.__, curr)
        const didButtonGoDownNow = didButtonGoDown(R.__, prev, curr)
        const didButtonGoUpNow = didButtonGoUp(R.__, prev, curr)
        //const didTriggerGoUpNow = didTriggerGoUp(R.__, prev, curr)

        // if(!ready)
        // {
        //     if(didButtonGoUpNow("cross"))
        //         setReady(true)
            
        //     return
        // }

        const dirs = findJoysticksDirections(prev)(curr)

        if(!(curr.leftAnalogX == 0 && curr.leftAnalogY == 0))
            setLeftAngle(thetaInDegrees([curr.leftAnalogX, curr.leftAnalogY]))

        if(!(curr.rightAnalogX == 0 && curr.rightAnalogY == 0))
            setRightAngle(thetaInDegrees([curr.rightAnalogX, curr.rightAnalogY]))

        // begin - new letter
        const newJoyDir = analyzeDirections(dirs)
        if(newJoyDir != null)
            addJoyDir(isButtonDownNow("r1"), newJoyDir)
        // end - new letter

        if(isButtonDownNow("r1") && !upperCase)
            setUpperCase(true)

        if(isButtonUpNow("r1") && upperCase)
            setUpperCase(false)

        if(didButtonGoUpNow("dPadLeft"))
            moveCursorLeft()

        if(didButtonGoUpNow("dPadRight"))
            moveCursorRight()

        if(didButtonGoUpNow("dPadUp") && !reallyChoosingNextWord)
            previousJ8InPhrase()

        if(didButtonGoUpNow("dPadDown") && !reallyChoosingNextWord)
            nextJ8InPhrase()

        if(didButtonGoUpNow("dPadUp") && reallyChoosingNextWord)
            previousNextWord()

        if(didButtonGoUpNow("dPadDown") && reallyChoosingNextWord)
            nextNextWord()

        if(didButtonGoUpNow("square"))
            onBackSpace()

        if(didButtonGoUpNow("cross"))
            addSpecialCharacter()

        if(didButtonGoUpNow("l1"))
            addSpace()

        if(didButtonGoUpNow("r2"))
            addEnter()

        if(isButtonDownNow("circle") && !choosingNextWord)
            startsChoosingNextWord()
        
        if(isButtonUpNow("circle") && choosingNextWord)
            endsChoosingNextWord()

        if(didButtonGoUpNow("triangle"))
            onBackspaceWord()


    }

    useEffect(() =>
    {
        document.addEventListener("keyup", onKeyUp)
        return () => document.removeEventListener("keyup", onKeyUp)
    })

    useEffect(() => subscribeToGamepadData("controllerkeyboard", gamepadDataListener))

    const onKeyUp = R.cond([
        [ R.pipe(keyCodeFromEvent, R.equals(keyCodes.left)), moveCursorLeft ],
        [ R.pipe(keyCodeFromEvent, R.equals(keyCodes.right)), moveCursorRight ],
        [ R.pipe(keyCodeFromEvent, R.equals(keyCodes.down)), nextJ8InPhrase ],
        [ R.pipe(keyCodeFromEvent, R.equals(keyCodes.up)), previousJ8InPhrase ],
        [ R.pipe(keyCodeFromEvent, R.equals(keyCodes.backspace)), onBackSpace ],
        [ R.pipe(keyCodeFromEvent, R.equals(keyCodes.space)), addSpace ]
    ])

    const sendIt = () =>
    {
        // remote.BrowserWindow.getFocusedWindow().minimize()
        // const casedPhraseStr = phraseToStr(casedPhrase)
        // console.log(phrasePart0Str)
        // sendFromRenderer("typeRobotText")(casedPhraseStr)
    }

    let prev, curr
    if(gamepadData != null)
    {
        prev = gamepadData.prev
        curr = gamepadData.curr
    }

    // if(gamepadData == null)
    //     return <HorizontalCenter>
    //         <NoDetectedContainer>
    //             <div>
    //                 <NoDetectedMain>No gamepad detected.</NoDetectedMain>
    //                 <NoDetectedMain>Please connect a gamepad.</NoDetectedMain>
    //             </div>
    //             <NoDetectedSub>
    //                 If you connected a gamepad and are still seeing this message, press a button on your gamepad.
    //             </NoDetectedSub>
    //         </NoDetectedContainer>
    //     </HorizontalCenter>

    // if(!ready)
    // {
    //     return <HorizontalCenter>
    //         <NoDetectedContainer>
    //             <div>
    //                 <NoDetectedMain>Gamepad detected!!</NoDetectedMain>
    //             </div>
    //             <NoDetectedSub>
    //                 Press X or A on your gamepad to test the prototype
    //             </NoDetectedSub>
    //         </NoDetectedContainer>
    //     </HorizontalCenter>
    // }

    let currLeftDir = -1, currRightDir = -1
    if(prev != null || curr != null)
    {
        const dirs = findJoysticksDirections(prev)(curr)
        currLeftDir = dirs.currLeftDir
        currRightDir = dirs.currRightDir
    }

    curr = defaultToEmptyObject(curr)

    return <>
        <HorizontalCenter>
            <Grid>

                <BumpersAndTriggersGrid visible={settings.displayBumpersAndTriggers}>
                    <VerticalCenterRightAlign><LeftFingerText>Specials</LeftFingerText></VerticalCenterRightAlign>
                    <VerticalCenterRightAlign><LeftFingerText>Space</LeftFingerText></VerticalCenterRightAlign>
                    <VerticalCenterLeftAlign><Trigger active={curr.l2}>{settings.gamepadType == "ps" ? "L2" : "LT"}</Trigger></VerticalCenterLeftAlign>
                    <VerticalCenterLeftAlign><Bumper active={curr.l1}>{settings.gamepadType == "ps" ? "L1" : "LB"}</Bumper></VerticalCenterLeftAlign>
                    <VerticalCenterRightAlign><Trigger active={curr.r2}>{settings.gamepadType == "ps" ? "R2" : "RT"}</Trigger></VerticalCenterRightAlign>
                    <VerticalCenterRightAlign><Bumper active={curr.r1}>{settings.gamepadType == "ps" ? "R1" : "RB"}</Bumper></VerticalCenterRightAlign>
                    <VerticalCenterLeftAlign><RightFingerText>Enter</RightFingerText></VerticalCenterLeftAlign>
                    <VerticalCenterLeftAlign><RightFingerText>Caps</RightFingerText></VerticalCenterLeftAlign>
                </BumpersAndTriggersGrid>

                <FoundWords>
                    <VerticalCenterer>
                        {foundWords
                            .map(upCasesLikeWordAtCursor)
                            .map((w, i) => <J8Word key={w} active={i == j8Index}>{w}</J8Word>)}
                    </VerticalCenterer>

                    <VerticalSpaceBetween>
                        <VerticalMargin>
                            <Arrow direction={0} />
                        </VerticalMargin>
                        <FancyVerticalLign height="100%" />
                        <VerticalMargin>
                            <Arrow direction={2} />
                        </VerticalMargin>
                    </VerticalSpaceBetween>
                </FoundWords>

                <JoysticksContainer>
                    <Joystick chars={leftAlphabet} activeDir={currLeftDir} angle={leftAngle} upperCase={upperCase}/>
                    <Joystick chars={rightAlphabet} activeDir={currRightDir} angle={rightAngle} upperCase={upperCase}/>
                </JoysticksContainer>

                <IconsContainer visible={settings.displayRightThumbButtons}>
                        <IconAndName>
                            <Triangle active={curr.triangle} gamepadType={settings.gamepadType}/>
                                <VerticalCenter>
                                    <Name>Backspace word</Name>
                                </VerticalCenter>
                        </IconAndName>
                        <IconAndName>
                            <Square active={curr.square} gamepadType={settings.gamepadType}/>
                            <VerticalCenter>
                                <Name>Backspace</Name>
                            </VerticalCenter>
                        </IconAndName>
                        <IconAndName>
                            <Circle active={curr.circle} gamepadType={settings.gamepadType}/>
                            <VerticalCenter>
                                <Name>Next words</Name>
                            </VerticalCenter>
                        </IconAndName>
                        <IconAndName>
                            <Cross active={curr.cross} gamepadType={settings.gamepadType}/>
                            <VerticalCenter>
                                <Name>Punctuation</Name>
                            </VerticalCenter>
                        </IconAndName>
                </IconsContainer>

            </Grid>
        </HorizontalCenter>


        { gamepadData == null && (
        <div>
            <NoDetectedMain>No gamepad detected.</NoDetectedMain>
            <NoDetectedMain>Please connect a gamepad.</NoDetectedMain>
            <NoDetectedSub>If you still see this message after having connected a gamepad, that's normal, you can test the prototype.</NoDetectedSub>
        </div> 
        )}

        <Phrase>
            {cuttedCasedPhrase[0]}
            <ActiveWord>{cuttedCasedPhrase[1]}</ActiveWord>
            {cuttedCasedPhrase[2]}
        </Phrase>
    </>
}



// BEGIN STYLES

const NoDetectedContainer = styled.div`
    margin-top: 100px;
`

const VerticalMargin = styled.div`
    margin: 9px 0;
`

const NoDetectedSub = styled.div`
    margin-top: 20px;
    text-align: center;
`

const NoDetectedMain = styled.div`
    font-size: 16pt;
    text-align: center;
`

const FoundWords = styled.div`
    width: 100%;
    font-weight: 300;
    overflow: hidden;
    word-wrap: break-word;
    grid-column: begin-left-words / begin-main;
    grid-row: begin-bumpers-and-triggers / end;
    display: flex;
    justify-content: flex-end;
`

const VerticalCenterer = styled.div`
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    align-items: flex-start;
`

const SuperCenterer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const VerticalSpaceBetween = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    align-items: center;
`

const JoysticksContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    min-width: 400px;
    grid-column: begin-main / begin-icons;
    grid-row: begin-main / end;
`

const Direction = styled.div`
    display: inline-block;
    border: ${p => p.active ? "2px" : "1px"} solid #F8ECD7;
    padding: 10px;
    margin: ${p => p.active ? "9px" : "10px"};
    box-sizing: border-box;
`

const VerticalDirection = styled(Direction)`
    margin-left: 40px;
    margin-right: 40px;
`

const J8Word = styled.div`
    margin: 5px;
    color: ${p => p.theme.secondaryColor};
    font-weight: ${p => p.active ? 1000 : 100};
`

const ActiveWord = styled.span`
    /* background: ${brightColor};
    color: ${darkColor}; */
    text-decoration: underline;
`

const Phrase = styled.div`
    /* display: flex;
    flex-wrap: wrap; */
    font-size: 20pt;
    font-weight: 300;
    margin: 0px 20px;
    text-align: center;
    white-space: pre;
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: [begin-left-words] 200px [begin-main] 700px [begin-icons ] 200px [end-icons];
    grid-template-rows: [begin-bumpers-and-triggers] 100px [begin-main] auto [end];
    /* border: 1px solid ${brightColor}; */
    padding: 50px 0;
    border-radius: 20px;
    /* zoom: 75%; */
    /* transform: scale(0.7); */
`

const IconsContainer = styled.div`
    grid-column-start: begin-icons;
    grid-row-start: begin-main;
    display: ${p => p.visible ? "flex" : "none"};
    flex-flow: column;
    justify-content: center;
    padding-left: 10px;
`

const IconAndName = styled.div`
    display: grid;
    grid-template-columns: 40px auto;
    grid-template-rows: auto auto auto auto;
    margin: 9px 0;
    position: relative;
`

const Name = styled.div`
    margin-left: 20px;
`

const BumpersAndTriggersGrid = styled.div`
    grid-column: begin-main / begin-icons;
    grid-row: begin-bumpers-and-triggers / begin-main;
    display: ${p => p.visible ? "grid" : "none"};
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 50px 50px;
    grid-auto-flow: column;
`

const VerticalCenter = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`

const VerticalCenterRightAlign = styled(VerticalCenter)`
    align-items: flex-end;
`

const VerticalCenterLeftAlign = styled(VerticalCenter)`
    align-items: flex-start;
`

const LeftFingerText = styled.span`
    margin-right: 20px;
`

const RightFingerText = styled.span`
    margin-left: 20px;
`

const HorizontalCenter = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    
    @media only screen and (max-width: 1350px) {
        zoom: 80%;
    }

    @media only screen and (max-width: 1150px) {
        zoom: 70%;
    }

    @media only screen and (max-width: 1000px) {
        zoom: 60%;
    }

    @media only screen and (max-width: 850px) {
        zoom: 50%;
    }
`


// END STYLES



