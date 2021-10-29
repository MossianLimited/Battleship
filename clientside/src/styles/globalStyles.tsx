import { createGlobalStyle } from "styled-components";

import { Theme } from "./theme";

const globalStyle = createGlobalStyle<{
    theme: Theme;
}>`

html {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

body {
    margin: 0;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
}

input, button {
    border: none;
    background-color: transparent;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    font-size: 16px;
    outline: none;
}

* {
    box-sizing: border-box;
}


@media (min-width: ${(props) => props.theme.breakPoints.desktop}px) {
    html {
        font-size: 18px;
    }
}

@media (min-width: ${(props) => props.theme.breakPoints.widescreen}px) {
    html {
        font-size: 24px;
    }
}

`;

export default globalStyle;
