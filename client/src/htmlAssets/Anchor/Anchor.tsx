import styles from "./Anchor.module.css"

interface AnchorProps {
    href: string; // The URL of the link's destination
    target?: string; // How the link should be opened
    text: string; // The text of the link
    className?: string; // The CSS class name of the link
}

export const AnchorElement = (props: AnchorProps) => {
    // Use the props to render the anchor element
    return (
        <a href={props.href} target={props.target} className={props.className}>
            {props.text}
        </a>
    );
};

// Define the default props for the anchor element
AnchorElement.defaultProps = {
    target: "_self", // The default value for the target prop
    className: `${styles.btn}`, // The default value for the className prop
};
