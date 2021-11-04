import React from "react";
import baseStyled, {
    ThemeContext,
    ThemedBaseStyledInterface,
} from "styled-components";

const theme = {
    colors: {
        square: {
            ally: {
                circle: "#6745FF",
                background: {
                    light: "#947EFF",
                    medium: "#947EFF",
                },
            },
            enemy: {
                circle: "#6745FF",
                background: {
                    light: "#947EFF",
                    medium: "#947EFF",
                },
            },
            text: {
                position: "white",
            },
        },
        danger: {
            main: "#FF9A61",
        },
        tutorial: {
            modal: {
                background: {
                    primary: "#674def",
                    light: "#FFFFFF",
                },
            },
            infoButton: {
                background: "#FFFFFF",
                text: "#917DF8",
            },
        },
        lobby: {
            avatar: {
                background: {
                    light: "#FFDBB4",
                    medium: "#FFB463",
                    white: "#FFFFFF",
                },
                selected: "#674DEF",
                text: {
                    name: "#3A2105",
                    versus: "#d57f23",
                    score: "#743c00",
                    chat: "#6d3900",
                },
            },
            backdrop: {
                medium: "#7B61FF",
                dark: "#674DEF",
                shadedLight: "#F8F7FF",
                light: "#FFFFFF",
            },
            button: {
                background: {
                    primary: "#6D51FD",
                    secondary: "#F0EDFF",
                    room: "#FFFFFF",
                    startGame: "#FFFFFF",
                },
                text: {
                    primary: "#FFFFFF",
                    secondary: "#6D51FD",
                    room: "#8A77EF",
                    roomDark: "#1C0B76",
                    startGame: "#674def",
                },
            },
            slider: {
                background: {
                    dark: "#302B4A",
                    light: "#FFFFFF",
                },
                text: {
                    selected: "#7b61ff",
                    default: "#D1CCEA",
                },
            },
            input: {
                background: {
                    light: "#F5F3FC",
                },
                text: {
                    placeholder: "#bcb7e2",
                },
            },
            info: {
                heading: "#1E088E",
                label: "#9591a4",
                guidelines: "#b0aace",
                battleship: "#ffffff",
            },
            credits: {
                light: "#9a86ff",
                medium: "#C0B4F9",
            },
        },
    },
    breakPoints: {
        mobile: 860,
        tablet: 1200,
        desktop: 1920,
        widescreen: 2560,
    },
};

export type Theme = typeof theme;

const useTheme = (): Theme => {
    return React.useContext(ThemeContext);
};

export { theme, useTheme };

const styled: ThemedBaseStyledInterface<Theme> = baseStyled;

export default styled;
