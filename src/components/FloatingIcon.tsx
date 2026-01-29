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
                ...svgProps
            } = props;

            return <motion.div 
                className="floating-icon"
                initial={{ y: -5 * (props.parallaxValue ?? 0), rotate: props.rotation }}
                animate={{ y: 5 * (props.parallaxValue ?? 0), rotate: (props.rotation ?? 0) + Math.random() * 10 - 5 }}
                transition={{ repeat: Infinity, duration: 3, repeatType: "mirror", ease: "easeInOut", delay: Math.random() }}
                style={{
                    top: props.y,
                    left: props.x,
                    width: `${props.size}px`,
                    opacity: props.opacity,
                    height: `${props.size}px`,
                    color: props.color,
                    filter: `blur(${props.blurPx ?? 0}px)`
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