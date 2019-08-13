import React, { useState } from "react"
import styled from "styled-components"
import * as R from "ramda"
import { VerticalLign } from "./Fancy"
import { Link } from "react-router-dom"
import { Redirect } from "react-router"

import video from "../assets/test-vid.mp4"


export default ({visited=false}) => {

    // locallyVisited = true

    // const [wantsToBeHere, setWantsToBeHere] = useState(true)

    // if(!wantsToBeHere)
    //     return <Redirect to="/home" />

    // if(!visited)
    // {
    //     return (
    //         <VideoContainer>
    //             <Video src={video} type="video/mp4" controls autoPlay/>
    //             <Continue onClick={() => setWantsToBeHere(false)}>Click here to skip concept video and continue to the website</Continue>
    //         </VideoContainer>

    //     )
    // }

    return (
        <SuperContainer>
            <VideoContainer>
                <Video src={video} type="video/mp4" controls autoPlay/>
            </VideoContainer>
        </SuperContainer>

    )
}

const SuperContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`


const VideoContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
`

const Video = styled.video`
    margin-top: 50px;
    margin-bottom: 25px;
    outline: none;
    max-width: 100%;
    max-height: 100%;
`

const Continue = styled.div`
    position: fixed;
    color: ${p => p.theme.primaryColor};
    background: ${p => p.theme.secondaryColor};
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    padding: 10px;
    animation: fadein 1s 2s forwards, fadeout 3s 15s forwards;
    opacity: 0;

    @keyframes fadein {

        from { opacity: 0; }
        to   { opacity: 1; }
    }

    @keyframes fadeout {

        from { opacity: 1; }
        to   { opacity: 0; }
    }

`