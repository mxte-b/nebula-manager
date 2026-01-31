import { FunctionComponent } from "react";
import Icons, { IconMap, SvgIconProps } from "./Icons";
import { Color } from "@tauri-apps/api/webview";
import { motion } from "motion/react";

export type SvgFloatingIconProps = SvgIconProps & {
    x: number | string,
    y: number | string,
    size?: number,
    rotation?: number,
    opacity?: number,
    color?: Color,
    blurPx?: number,
    parallaxValue?: number,
};

export type SvgFloatingIcon = FunctionComponent<SvgFloatingIconProps>;
export type FloatingIconMap = Record<string, SvgFloatingIcon>;

const wrapIcons = (icons: IconMap) => {
    const wrapped = {} as FloatingIconMap;

    for (const key in icons) {
        const Icon = icons[key];

        wrapped[key] = ((props) => {
            const {
                x,
                y,
                size,
                rotation,
                opacity,
                color,
                blurPx,
                parallaxValue,
                ...svgProps
            } = props;

            return <motion.div 
                className="floating-icon"
                initial={{ y: -5 * (parallaxValue ?? 0), rotate: rotation }}
                animate={{ y: 5 * (parallaxValue ?? 0), rotate: (rotation ?? 0) + Math.random() * 10 - 5 }}
                transition={{ repeat: Infinity, duration: 3, repeatType: "mirror", ease: "easeInOut", delay: Math.random() }}
                style={{
                    top: y,
                    left: x,
                    width: `${size}px`,
                    opacity: opacity,
                    height: `${size}px`,
                    color: color,
                    filter: `blur(${blurPx ?? 0}px)`
                }}
            >
                <Icon {...svgProps} />
            </motion.div>
        })
    }

    return wrapped;
}

const FloatingIcon = wrapIcons(Icons);

export default FloatingIcon;