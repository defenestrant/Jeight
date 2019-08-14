import * as R from "ramda"
import React, { useState, useEffect } from "react"
import styled, { ThemeProvider } from "styled-components"
import { BrowserRouter as Router, Route } from "react-router-dom"

import Joysticks from "./Joysticks"
import Menu from "./Menu"
import Settings from "./Settings"
import PageVideo from "./PageVideo"
import PageHome from "./PageHome"
import logoPng from "../assets/logo.png"

import { newBaseDocmap } from "../logic/prediction"

import GlobalStyles from "./GlobalStyles"

import languageBaseDocmapUrl_EN from "../assets/basedocmap-en"
import languageBaseDocmapUrl_NL from "../assets/basedocmap-nl"
import { wait } from "../logic/utils";

const languageBaseDocmapUrls = {
    en: languageBaseDocmapUrl_EN,
    nl: languageBaseDocmapUrl_NL
}


const defaultSettings = {
    displayBumpersAndTriggers: true,
    displayRightThumbButtons: true,
    primaryColor: "#1C1C1C",
    secondaryColor: "#F8ECD7",
    additions: "",
    language: "en",
    gamepadType: "xbox"
}

//const stringifyAndSetlocalStorage = key => R.pipe(JSON.stringify, R.curry(localStorage.setItem)(key)) // Doesn't work - TypeError: Illegal Invocation
const stringifyAndSetLocalStorage = key => obj => localStorage.setItem(key, JSON.stringify(obj))

export default ({ savedSettings, savedAdditionsBaseDocmap, visited }) =>
{
    console.log("App render")

    const [ languageBaseDocmaps, setLanguageBaseDocmaps ] = useState({})
    const [ additionsBaseDocmap, setAdditionsBaseDocmap ] = useState(savedAdditionsBaseDocmap)
    const [ settings, setSettings ] = useState(savedSettings == null ? defaultSettings : savedSettings)
    const [ resetSettingsCount, setResetSettingsCount ] = useState(0)
    const [ text, setText ] = useState({phrase: [], casing: []})

    console.log("additionsBaseDocmap", additionsBaseDocmap)

    useEffect(() => {
        if(languageBaseDocmaps[settings.language] != null)
            return


        const fetchData = async () => {
            await wait(500)
            const baseDocmapResponse = await fetch(languageBaseDocmapUrls[settings.language])
            const baseDocmap = await baseDocmapResponse.json()
            setLanguageBaseDocmaps(v => ({...v, [settings.language]: baseDocmap}))
            console.log("languageBaseDocmap", baseDocmap)
        }
        fetchData()
    }, [settings.language])


    const setAndSaveSettings = newSettings => {
        console.log("set and save settings + localstorage")
        setSettings(newSettings)

        if(settings.additions != newSettings.additions)
        {
            const additionsBaseDocmap = newBaseDocmap(newSettings.additions)
            setAdditionsBaseDocmap(additionsBaseDocmap)
            stringifyAndSetLocalStorage("additionsBaseDocmap")(additionsBaseDocmap)
        }

        stringifyAndSetLocalStorage("settings")({ ...newSettings, "_v": "0.1"})
    }

    const resetSettings = () => {
        setResetSettingsCount(R.add)
        setAndSaveSettings({ ...defaultSettings, additions: settings.additions })
    }



    const menuItems = [
        {
            path: "/home",
            name: "Home",
            component: <PageHome />
        },
        {
            path: "/prototype",
            name: "Prototype",
            component: <Joysticks
                        key="joysticks"
                        languageBaseDocmap={languageBaseDocmaps[settings.language]}
                        additionsBaseDocmap={additionsBaseDocmap}
                        settings={settings}
                        savedText={text}
                        saveText={setText}/>
        },
        {
            path: "/settings",
            name: "Settings",
            component: <Settings key={resetSettingsCount}
                onChangeSettings={setAndSaveSettings}
                settings={settings}
                onResetSettings={resetSettings}
                />
        },
        {
            path: "/conceptvideo",
            name: "Concept Video",
            component: <PageVideo visited={visited}/>
        },
    ]


    return (
        <Router>
            <ThemeProvider theme={{primaryColor: settings.primaryColor, secondaryColor: settings.secondaryColor}}>

                <Container>
                    {/* <MacFix /> */}
                    <GlobalStyles />

                    <Header>
                        <Logo />
                        <TitleContainer>
                            <Title>Jeight.io</Title>
                            <SubTitle>A Virtual Gamepad Keyboard Prototype</SubTitle>
                        </TitleContainer>
                    </Header>

                    <MenuInGrid>
                        <Menu links={menuItems} />
                    </MenuInGrid>

                    <ContentContainer>
                        {menuItems.map(mi => <Route key={mi.path} path={mi.path} exact render={() => mi.component} />)}
                    </ContentContainer>
                </Container>
            </ThemeProvider>
        </Router>
    )
}

const MacFix = styled.div`
    position: fixed;
    top: -200px;
    left: -200px;
    bottom: -200px;
    right: -200px;
    background: ${p => p.theme.primaryColor};
    z-index: -200;
`


// BEGIN STYLES
const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    //font-family: "Courier New";
    font-family: "Avenir Next";
    //font-weight: 100;
    padding: 25px;
    box-sizing: border-box;
    user-select: none;
    background: ${p => p.theme.primaryColor};
    color: ${p => p.theme.secondaryColor};
    box-sizing: border-box;
    display: grid;
    grid-template-rows: 100px auto;
    grid-template-columns: auto 150px;
    overflow: scroll;
`

const Header = styled.div`
    display: flex;
    align-items: center;
    grid-column: 1 2;
    grid-row: 1 2;
`

const Logo = styled.div`
    background: ${p => p.theme.secondaryColor};
    width: 50px;
    height: 100%;
    mask: url(${logoPng}) center center no-repeat;
    mask-size: contain;
    margin-left: 50px;
`

const TitleContainer = styled.div`
    margin-left: 30px;
`

const Title = styled.div`
    font-size: 30pt;
    margin-top: 30px;
`

const SubTitle = styled.div`
    position: relative;
    font-size: 13pt;
    top: 7px;
`
const MenuInGrid = styled.div`
    grid-column: 2;
    grid-row: 1 / 3;
`

const ContentContainer = styled.div`
    box-sizing: border-box;
    margin: 20px;
`

// END STYLES