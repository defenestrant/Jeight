import React, { useState } from "react"
import { Cross, Arrow } from "./Fancy"
import styled from "styled-components"

export default ({selectMultiple = true, items, onChange}) => {

    return <>
        {items.map(i => (
            <PointerAndHorizontalFlexDiv key={i.val} onClick={() => onChange(i.val)}>
                <Cross selected={i.selected} />
                <BasicSettingsText>{i.label}</BasicSettingsText>
            </PointerAndHorizontalFlexDiv>
        ))}
    </>
}


const PointerAndHorizontalFlexDiv = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 20px 0;
`

const BasicSettingsText = styled.div`
    margin-left: 20px;
`