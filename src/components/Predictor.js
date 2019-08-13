

import * as R from "ramda"
import React, { useState } from "react"

import memoize from "memoize-one"
import styled from "styled-components"

import newDocMap, { newSentenceWithWord } from "../logic/prediction"





const ProposalContainer = styled.div`
    display: flex;
    flex-direction: horizontal;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
`

const Proposal = styled.div`
    border: 1px solid grey;
    padding: 5px;
    margin: 5px;
    cursor: pointer;
`

const InputContainer = styled.div`
    width: 100%;
    height: 25px;
    box-sizing: border-box;
    margin-bottom: 25px;
`

const Input = styled.input`
    width: 100%;
    height: 100%;
    font-family: "Courier New";
    font-size: 12pt;
    color: black;

    &:focus {
        outline: none;
        border: 1px solid black;
    }
`

// getLatestWord : str -> str
const getDoc = docMap => word => docMap[word]

// topFive : docMap -> [str]
const topFive =
    ( R.compose )
    ( R.map(R.prop(0))
    , R.take(5)
    , R.sort(R.descend(R.compose(R.prop("count"), R.prop(1))))
    , R.toPairs
    )

const getLatestWord =
    ( R.compose )
    ( R.last
    , R.split(" ")
    , R.trim )

// getSortedFollowedBy : followedBy -> [string]
const sortFollowedBy =
    ( R.compose )
    ( R.map(R.prop(0))
    , R.sort(R.descend(R.prop(1)))
    , R.toPairs )

// proposals : string -> JSX.Element
const proposalsMapper = fn => str => <Proposal key={str} onClick={() => fn(str)}>{str}</Proposal>




export default ({docMap}) => {
    const [text, setText] = useState("");

    const onProposalClick = word => setText(newSentenceWithWord(word)(text))

    let proposals
    if(R.trim(text) == "")
    {
        proposals =
            ( R.map )
            ( proposalsMapper(onProposalClick) )
            ( topFive(docMap) )
    }
    else
    {
        const doc =
            (getDoc)
            (docMap)
            (getLatestWord(text))

        if(doc != null)
        {
            proposals =
                ( R.map )
                ( (proposalsMapper) (onProposalClick) )
                ( (sortFollowedBy) (doc.followedBy) )
        }
    }


    return (
        <div>

            <InputContainer>
                <Input value={text} onChange={e => setText(e.target.value)} />
            </InputContainer>

            <div>
                <ProposalContainer>{proposals}</ProposalContainer>
            </div>

        </div>
    );
}

