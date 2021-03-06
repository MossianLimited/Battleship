import { FC } from "react";

interface Props {
    size?: number | string;
    color?: string;
}

const Left: FC<Props> = ({ size, color }) => {
    return (
        <svg
            width={size || "2rem"}
            height={size || "2rem"}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M18.0939 27.8187L16.7064 29.2062C16.1189 29.7937 15.1689 29.7937 14.5877 29.2062L2.4377 17.0624C1.8502 16.4749 1.8502 15.5249 2.4377 14.9437L14.5877 2.79365C15.1752 2.20615 16.1252 2.20615 16.7064 2.79365L18.0939 4.18115C18.6877 4.7749 18.6752 5.74365 18.0689 6.3249L10.5377 13.4999H28.5002C29.3314 13.4999 30.0002 14.1687 30.0002 14.9999V16.9999C30.0002 17.8312 29.3314 18.4999 28.5002 18.4999H10.5377L18.0689 25.6749C18.6814 26.2562 18.6939 27.2249 18.0939 27.8187Z"
                fill={color || "#91510e"}
            />
        </svg>
    );
};

export default Left;
