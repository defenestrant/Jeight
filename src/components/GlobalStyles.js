import { createGlobalStyle } from "styled-components"

import AvenirNextMedium from "../assets/fonts/avenir-next/AvenirNext-Medium.ttf"
import AvenirNextUltraLight from "../assets/fonts/avenir-next/AvenirNext-UltraLight.ttf"

import fontsCss from "../assets/fonts.css"

export default createGlobalStyle`

    @import "${fontsCss}";



    a {
        outline: 0;
    }
`
