import { useState } from "react";

const useToggleState = (delay: number = 2000) => {
    const [copied, setCopied] = useState<boolean>(false);

    const toggleState = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, delay);
    };

    return {
        copied,
        toggleState,
    };
};

export default useToggleState;
