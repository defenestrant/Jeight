import React, { useState } from "react"
import styled from "styled-components"
import * as R from "ramda"
import { VerticalLign } from "./Fancy"
import { Link } from "react-router-dom"
import { Redirect } from "react-router"

import video from "../assets/test-vid.mp4"

import gamepadDefaultPng from "../assets/gamepad-default.png"
import gamepadMediumPng from "../assets/gamepad-medium.png"
import gamepadSmallPng from "../assets/gamepad-small.png"
import gamepadLettersPng from "../assets/gamepad-letters.png"
import gamepadSpecialsPng from "../assets/gamepad-specials.png"
import joysticksPng from "../assets/joysticks.png"
import typeFastGif from "../assets/type-fast.gif"
import iconGitHubPng from "../assets/icon-github.png"
import iconRamdaPng from "../assets/icon-ramdajs.png"
import iconReactPng from "../assets/icon-reactjs.png"
import iconRedditPng from "../assets/icon-reddit.png"

import { Circle, Square, Triangle, Cross, Arrow, Bumper, Trigger } from "./Fancy"
import { useInterval } from "./hooks";

export default () =>
{

    return (
        <OuterContainer>
            <InnerContainer>
                <GamepadDefault />
                <Title>What is it?</Title>
                <Paragraph>Jeight.io is a prototype for a new type of virtual keyboard to use with a gamepad. It’s written in Javascript and that means that you can <Underline>test it right here</Underline> in your browser on Windows or MacOS! No need to download anything.</Paragraph>
                <Paragraph>The only thing you need to do is connect your controller to your computer and go to the <Underline>prototype page</Underline>. Make sure to use the latest version of Chrome or Firefox.</Paragraph>
                <FastTypeGif src={typeFastGif} />
                <Title>How to use it?</Title>
                <Paragraph>Check out this video or read the text below!</Paragraph>
                <FilmAndFeaturesContainer>
                    <VideoContainer>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/q43XiHxvX18" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        {/* <Video src={video} type="video/mp4" controls /> */}
                    </VideoContainer>
                    <FeaturesContainer>
                        <div>Features</div>
                        <Feature>Only 1 action per letter</Feature>
                        <Feature>Dictionary-powered T9-like keyboard</Feature>
                        <Feature>Next word prediction</Feature>
                        <Feature>Cross platform</Feature>
                        <Feature>Open Source</Feature>
                        <Feature>Any color scheme</Feature>
                    </FeaturesContainer>
                </FilmAndFeaturesContainer>
                <Paragraph>The letters of the alphabet have been divided into 8 groups. Every group of letters is selectable with one of the directions of the joystick. </Paragraph>
                <Paragraph>If you want to write the word “noob”, you must first select the group “m n o”, since the “n” is there. Do this by moving your right joystick up once and release it again. Do this 2 more times to select the following 2 letters: “o”, “o”. Now select the final letter group that contains the “b”, by moving the left joystick up once.  </Paragraph>
                <Paragraph>You’ll see you have written the word “mona”. This is because the dictionary that powers Jeight does not know the word “noob”. If you look closely, you’ll see that the word “mona”. is made with the same letter groups as “noob”. But unfortunately, the dictionary does not know the word, so it cannot propose it. If you go to the settings, you can add the word “noob” as your own addition to the dictionary. </Paragraph>
                <Paragraph>If you’ll try to type it again, you’ll see it’s been added, but you can still change it to “mona”, if that’s the word you actually wanted to type. </Paragraph>
                <Paragraph>To change between proposed words, use the DPAD DOWN or UP keys on your controller, for the selected word.</Paragraph>
                <Paragraph>A word is selected when it’s <Underline>underlined</Underline>.</Paragraph>
                <Paragraph>If you’ve typed an error in your phrase in a previous word, you can move your selection to it with the DPAD LEFT and RIGHT keys. </Paragraph>
                <Title>Summary</Title>
                <SummaryContainer>
                    <SummaryItem center><Joysticks /></SummaryItem>
                    <SummaryItem>Select letters</SummaryItem>
                    <SummaryItem center>
                        <Vertical>
                            <Arrow direction={0} />
                            <Space />
                            <Arrow direction={2} />
                        </Vertical>
                    </SummaryItem>
                    <SummaryItem>Choose word from dictionary</SummaryItem>
                    <SummaryItem center>
                        <Arrow direction={3} />
                        <Space />
                        <Arrow direction={1} />
                    </SummaryItem>
                    <SummaryItem>Move cursor</SummaryItem>
                    <SummaryItem center><Triangle /></SummaryItem>
                    <SummaryItem>Backspace one word at a time</SummaryItem>
                    <SummaryItem center><Square /></SummaryItem>
                    <SummaryItem>Backspace one letter</SummaryItem>
                    <SummaryItem center><Circle /></SummaryItem>
                    <SummaryItem>Next words</SummaryItem>
                    <SummaryItem center><Cross /></SummaryItem>
                    <SummaryItem>Punctuation</SummaryItem>
                    <SummaryItem center><Bumper>L1</Bumper></SummaryItem>
                    <SummaryItem>Space</SummaryItem>
                    <SummaryItem center><Bumper>R1</Bumper></SummaryItem>
                    <SummaryItem>Caps</SummaryItem>
                    <SummaryItem center><Trigger>R2</Trigger></SummaryItem>
                    <SummaryItem>Enter</SummaryItem>
                </SummaryContainer>
                <Title>Why?</Title>
                <Paragraph>If you have ever been frustrated with how slow and cumbersome it is to type on a console with a controller, then you’ve already experienced my exact feelings when I decided on this creation. I never really understood why were no real alternatives to the equivalent of a picture of a keyboard on the popular consoles. People are familiar with a standard keyboard, yes, it’s easy to get going and to support all languages. But, I think gamers are very open to other options if they might prove more efficient. #NoXPWaste</Paragraph>
                <Paragraph>Jeight is also the final work of my Bachelor in Multimedia and Communications-technology. It is written  in Javascript with ReactJS and RamdaJS and I have Open Sourced it on GitHub. For me, this project was me dipping my toes for the first time in the world of Functional Programming. I have uncovered a liking for it and will keep exploring its depths. I hope this project will serve as a tool by which near-future employers could judge me. </Paragraph>
                <IconsContainer>
                    <Icon src={iconReactPng} href="https://reactjs.org/" target="_blank"/>
                    <Icon src={iconRamdaPng} href="https://ramdajs.com/" target="_blank"/>
                </IconsContainer>
                <Title>Feedback for the Future?</Title>
                <Paragraph>I am already incredibly happy with this baseline prototype, but would love to go further. Now I will gauge the interest people have and the feedback I get. If you have any feedback, I’ve made a subreddit where you can post all your questions and your feedback. You can also make an issue on GitHub and we can look at it together! :) </Paragraph>
                <IconsContainer>
                    <Icon src={iconGitHubPng} href="https://github.com/defenestrant/Jeight/" target="_blank"/>
                    <Icon src={iconRedditPng} href="https://www.reddit.com/r/jeight/" target="_blank"/>
                </IconsContainer>
                <Title>Further concepts</Title>
                <OuterContainer>
                    <FeatureContainer>
                        <FeatureTitle>Scale down visual interface by experience</FeatureTitle>
                        <FeatureText>The idea is that the more you use the keyboard, the more you remember which button does what, the less you need the visual interface.</FeatureText>
                        <GamepadDefault />
                        <GamepadMedium />
                        <GamepadSmall />
                        <FeatureTitle>Manual mode</FeatureTitle>
                        <FeatureText>In the old phones, you could go into manual mode and choose to type each key up to 3 or 4 times to select a letter. Similarly, here you could select a letter group with your joystick and tap L1 a number of times to select your desired letter.</FeatureText>
                        <GamepadLetters />
                        <FeatureTitle>Special characters</FeatureTitle>
                        <FeatureText>Similar selection mode as manual mode.</FeatureText>
                        <GamepadSpecials />
                    </FeatureContainer>
                </OuterContainer>
                {/* <J8Showoff letterGroups={[["a","b","c"], ["a","b","c"], ["d","e","f"]]} /> */}
            </ InnerContainer>
        </OuterContainer>
    )

}

const OuterContainer = styled.div`
    width: 100%;
    margin-left: 20px;
    margin-right: 20px;
    display: flex;
    justify-content: center;
`

const InnerContainer = styled.div`
    max-width: 1000px;
`

const FastTypeGif = styled.img`
    //transform: scale(0.6);
    max-width: 100%;
`

const Title = styled.h2`
    margin-top: 50px;
    margin-left: -20px;
`

const Paragraph = styled.p`
    //max-width: 1000px;
`

const GamepadDefault = styled.div`
    //width: 835px;
    height: 360px;
    max-width: 100%;
    background: ${p => p.theme.secondaryColor};
    mask: url(${gamepadDefaultPng}) center center no-repeat;
    mask-size: contain;
    margin-top: 40px;
`

const GamepadMedium = styled.div`
    height: 240px;
    max-width: 100%;
    background: ${p => p.theme.secondaryColor};
    mask: url(${gamepadMediumPng}) center center no-repeat;
    mask-size: contain;
    margin-top: 40px;
`

const GamepadSmall = styled.div`
    height: 225px;
    max-width: 100%;
    background: ${p => p.theme.secondaryColor};
    mask: url(${gamepadSmallPng}) center center no-repeat;
    mask-size: contain;
    margin-top: 40px;
`

const GamepadLetters = styled.div`
    height: 225px;
    max-width: 100%;
    background: ${p => p.theme.secondaryColor};
    mask: url(${gamepadLettersPng}) center center no-repeat;
    mask-size: contain;
    margin-top: 40px;
`

const GamepadSpecials = styled.div`
    height: 225px;
    max-width: 100%;
    background: ${p => p.theme.secondaryColor};
    mask: url(${gamepadSpecialsPng}) center center no-repeat;
    mask-size: contain;
    margin-top: 40px;
`

const FilmAndFeaturesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`

const VideoContainer = styled.div`
    background-color: black;
`

const Video = styled.video`
    outline: none;
    width: 100%;
    min-width: 400px;
    max-width: 500px;
`

const FeaturesContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 50px;
    min-width: 300px;
    margin-top: 20px;
`

const Feature = styled.div`
    margin: 5px 0;
    padding: 2px 10px;
    background: ${p => p.theme.secondaryColor};
    color: ${p => p.theme.primaryColor};
`

const Underline = styled.span`
    text-decoration: underline;
`

const SummaryContainer = styled.div`
    display: grid;
    grid-template-columns: 235px auto;
    grid-template-rows: auto auto auto auto auto auto auto auto auto auto;
`

const Joysticks = styled.div`
    width: 130px;
    height: 62px;
    background: ${p => p.theme.secondaryColor};
    mask: url(${joysticksPng}) center center no-repeat;
    mask-size: contain;
`

const SummaryItem = styled.div`
    display: flex;
    align-items: center;
    ${p => p.center && "justify-content: center;"}
    margin: 10px;
`

const Space = styled.div`
    width: 10px;
    height: 10px;
`

const Vertical = styled.div`
    display: flex;
    flex-direction: column;
`

const IconsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: space-between;
`

const Icon = styled.a`
    display: block;
    width: 100px;
    height: 100px;
    background: ${p => p.theme.secondaryColor};
    mask: url(${p => p.src}) center center no-repeat;
    mask-size: contain;
    margin: 30px 70px;
`

const FeatureContainer = styled.div`
    width: 70%;
`

const FeatureTitle = styled.div`
    margin-top: 50px;
    font-size: 27pt;
    text-align: center;
`

const FeatureText = styled.div`
    text-align: center;
`

const Letter = styled.div`
    font-family: 'Courier New';
    ${p => p.active && "font-weight: 1000;"}
`

const Horizontal = styled.div`
    display: flex;
`
const LetterGroup = styled.div`
    margin: 3px;
`

const J8Showoff = ({interval, letterGroups, words}) =>
{


    const lettersJsx = letterGroups.map(lg => <LetterGroup>{lg.map(l => <Letter>{l}</Letter>)}</LetterGroup> )

    useInterval(() => {


    }, interval)


    return <Horizontal>{lettersJsx}</Horizontal>
}

