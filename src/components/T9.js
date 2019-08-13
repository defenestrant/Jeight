

import R from "ramda"
import React, { useState, useEffect } from "react"

import memoize from "memoize-one"
import styled from "styled-components"


const trace = R.tap(console.log)

// // index -> string -> string
// const phrasePart1 = R.splitAt

// // index -> string -> string
// const phrasePart2 = index => str => R.splitAt(R.length(str) - index)

const leftKeyCode = 37
const rightKeyCode = 39
const keyCodeFromEvent = R.prop("keyCode")



// char -> bool
const isCharWordSplitter = char =>
    ( R.any )
    ( R.equals(char) )
    ( [" ",".", "/",">","<","|","(",")","{","}","[","]","&","#","%","@","-","_","=",":",";","+","-","*","=","%","€","$","£","°","^","\\","\'","\"",",","`","‘","—"] )

const st = R.complement(R.gt)
const ste = R.complement(R.gte)

// index -> str -> bool
const oneMoreExceedsStrLength = index =>
    ( R.pipe )
    ( R.length
    , R.gte(index) )

// index -> str -> index
const getNextCharPos = index =>
    ( R.ifElse )
    ( oneMoreExceedsStrLength(index) )
    ( ( R.pipe )
      ( R.length
      , R.add(-1)
      )
    )
    ( R.always(index + 1) )

// index -> index
const getPrevCharPos =
    ( R.ifElse )
    ( R.gte(1) )
    ( R.always(0) )
    ( R.add(-1) )


const indexWordStart = cursorPosition =>
    ( R.ifElse )
    ( R.pipe(R.nth(cursorPosition), isCharWordSplitter) )
    ( R.always(cursorPosition) )
    ( ( R.ifElse )
      ( R.gte(0) )
      ( R.always(0) )
      ( a => indexWordStart(cursorPosition - 1)(a) )
    )

// cursorPosition -> string -> index
const indexWordEnd = cursorPosition =>
    ( R.ifElse )
    ( R.pipe(R.nth(cursorPosition), isCharWordSplitter) )
    ( R.always(cursorPosition + 1) )
    ( ( R.ifElse )
      ( oneMoreExceedsStrLength(cursorPosition) )
      ( R.length )
      ( a => indexWordEnd(cursorPosition + 1)(a) )
    )

// cursorPosition -> string -> string
const cutPhrase = cursorPosition => str => {

    const start = indexWordStart(cursorPosition)(str)
    const end = indexWordEnd(cursorPosition)(str)

    if(end - start == 1)
        return [
            str.substring(0, start),
            str.substring(start, end),
            str.substring(end, Infinity)
        ]

    if(end == str.length - 1)
        return [
            str.substring(0, start + 1),
            str.substring(start + 1, end + 2),
            str.substring(end + 2, Infinity)
        ]

    return [
        str.substring(0, start + 1),
        str.substring(start + 1, end - 1),
        str.substring(end - 1, Infinity)
    ]
}

const defaultPhrase = "Hallo ik ben Ruben, e jij bent een lelijke eend"

const r =
    //R.nth(3)(defaultPhrase)
    indexWordStart(5)(defaultPhrase)
    //cutPhrase(48)(defaultPhrase)
    //defaultPhrase.substring(6, 8)
    //indexWordEnd(5)(defaultPhrase)
    //oneMoreExceedsStrLength(3)("abc")
    //getNextCharPos(4)("abc")

console.log(r)


// ************************************************************



export default () =>
{

    const [phrase, setPhrase] = useState(defaultPhrase)
    const [cursorPosition, setCursorPosition] = useState(5)//useState(R.length(defaultPhrase))

    const moveCursorLeft = () => setCursorPosition(cursorPosition - 1)
    const moveCursorRight = () => setCursorPosition(cursorPosition + 1)

    useEffect(() =>
    {
        document.addEventListener("keyup", onKeyUp)
        return () => document.removeEventListener("keyup", onKeyUp)
    })

    const onKeyUp = R.cond([
        [ R.pipe(keyCodeFromEvent, R.equals(leftKeyCode)), moveCursorLeft ],
        [ R.pipe(keyCodeFromEvent, R.equals(rightKeyCode)), moveCursorRight ]
    ])

    const cuttedPhrase = cutPhrase(cursorPosition)(phrase)
    console.log(cuttedPhrase)

    return (
        <div onKeyUp={onKeyUp}>
            <span>{cuttedPhrase[0]}</span>
            <ActiveWord>{cuttedPhrase[1]}</ActiveWord>
            <Cursor />
            <span>{cuttedPhrase[2]}</span>
            <div>cursorPos: {cursorPosition}</div>
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
    text-decoration: underline;
`
