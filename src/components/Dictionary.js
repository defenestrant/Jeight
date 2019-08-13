

import * as R from "ramda"
import React, { useState } from "react"

import memoize from "memoize-one"
import styled from "styled-components"



const Input = styled.textarea`
    width: 100%;
    height: 70%;
    &:focus {
        outline: none;
        border: 1px solid black;
    }
`

const fixNewLines = R.replace(/\n/g)("\r\n")

export default ({ defaultValue, onSave }) =>
{
    const [dic, setDic] = useState(defaultValue)

    const onSaveClick = () =>
    {
        onSave(dic)
    }

    return (
        <>
            <Input value={dic} onChange={e => setDic(e.target.value)} />
            <button onClick={onSaveClick}>Save</button>
        </>
    )
}


