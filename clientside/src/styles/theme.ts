import React from "react";
import baseStyled, {
    ThemeContext,
    ThemedBaseStyledInterface,
} from "styled-components";

const theme = {
    colors: {
        primary: {
            100: "rgba(97, 198, 255, 0.2)",
            200: "rgba(97, 198, 255, 0.4)",
            300: "#61C6FF",
        },
        neutral: {
            100: "rgba(157, 157, 157, 0.2)",
            200: "rgba(157, 157, 157, 0.4)",
            300: "rgba(53, 56, 57, 0.5)",
        },
        danger: {
            100: "#FF0055",
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
