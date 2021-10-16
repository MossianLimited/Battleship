import React from "react";
import baseStyled, {
    ThemeContext,
    ThemedBaseStyledInterface,
} from "styled-components";

const theme = {
    colors: {
        square: {
            player: {
                circle: "#61C6FF",
                background: {
                    light: "rgba(97, 198, 255, 0.2)",
                    medium: "rgba(97, 198, 255, 0.4)",
                },
            },
            enemy: {
                circle: "rgba(53, 56, 57, 0.5)",
                background: {
                    light: "rgba(157, 157, 157, 0.2)",
                    medium: "rgba(157, 157, 157, 0.4)",
                },
            },
        },
        text: {
            position: "rgba(113, 124, 150, 0.7)",
        },
        danger: {
            main: "#FF0055",
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
