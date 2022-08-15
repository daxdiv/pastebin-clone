import { useState } from "react";

const useCopyState = () => {
    const [copied, setCopied] = useState<boolean>(false);
    const DELAY_IN_MS = 2000;

    const toggleCopyState = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, DELAY_IN_MS);
    };

    return {
        copied,
        toggleCopyState,
    };
};

export default useCopyState;
