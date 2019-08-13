

import * as R from "ramda"
import React, { useState, useEffect } from "react"

import memoize from "memoize-one"
import styled from "styled-components"



const leftKeyCode = 37
const rightKeyCode = 39
const backspaceKeyCode = 8

const keyCodeFromEvent = R.prop("keyCode")

const defaultPhrase = [
    "Hallo",
    " ",
    "ik",
    " ",
    "ben",
    " ",
    "Ruben",
    ",",
    " ",
    "e",
    " ",
    "jij",
    " ",
    "bent",
    " ",
    "een",
    " ",
    "lelijke",
    " ",
    "eend",
    "."
]

// cursorPosition -> phrase -> word/character
const extractWord = cursorPosition => R.slice(cursorPosition, cursorPosition + 1)

// cursorPosition -> phrase -> [phrase, word, phrase]
const cutPhrase = cursorPosition => phrase => [
    R.slice(0, cursorPosition, phrase),
    extractWord(cursorPosition)(phrase),
    R.slice(cursorPosition + 1, Infinity, phrase)
]

// cursorPosition -> phrase -> phrase
const backSpaceInPhrase = cursorPosition => phrase => {
    if(R.nth(cursorPosition)(phrase).length == 1)
        return R.remove(cursorPosition, 1, phrase)

    return phrase.map((v, i) => i == cursorPosition ? R.dropLast(1, v) : v)
}



const wordToSpan = (str, i) => <span key={i}>{str}</span>

const phraseToStr = R.chain(R.identity)

console.log(phraseToStr(defaultPhrase))

export default () =>
{
    const [phrase, setPhrase] = useState(defaultPhrase)
    const [cursorPosition, setCursorPosition] = useState(5)//useState(R.length(defaultPhrase))

    const moveCursorLeft = () => cursorPosition == 0 ? 0 : setCursorPosition(cursorPosition - 1)
    const moveCursorRight = () => cursorPosition == phrase.length - 1 ? phrase.length - 1 : setCursorPosition(cursorPosition + 1)
    const onBackSpace = () => 
    {
        const newPhrase = backSpaceInPhrase(cursorPosition)(phrase)
        setPhrase(newPhrase)

        if(newPhrase.length != phrase.length)
            moveCursorLeft()
    }

    useEffect(() =>
    {
        document.addEventListener("keyup", onKeyUp)
        return () => document.removeEventListener("keyup", onKeyUp)
    })

    

    const onKeyUp = R.cond([
        [ R.pipe(keyCodeFromEvent, R.equals(leftKeyCode)), moveCursorLeft ],
        [ R.pipe(keyCodeFromEvent, R.equals(rightKeyCode)), moveCursorRight ],
        [ R.pipe(keyCodeFromEvent, R.equals(backspaceKeyCode)), onBackSpace ]
    ])

    const cuttedPhrase = cutPhrase(cursorPosition)(phrase)

    console.log(cuttedPhrase)

    return (
        <div onKeyUp={onKeyUp}>
            <pre>
            <span>{phraseToStr(cuttedPhrase[0])}</span>
            <ActiveWord>{phraseToStr(cuttedPhrase[1])}</ActiveWord>
            <span>{phraseToStr(cuttedPhrase[2])}</span>
            </pre>
            <div>cursorPos: {cursorPosition}</div>
            <div>word: {extractWord(cursorPosition)(phrase)}</div>
        </div>
    )
}

const Cursor = styled.div`
    width: 2px;
    height: 20px;
    background: white;
    display: inline-block;
    position: relative;
    top: 3px;
`

const ActiveWord = styled.span`
    color: #1C1C1C;
    background: #F8ECD7;
`
