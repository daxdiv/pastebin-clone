import { useState } from "react";

const useToggleState = (delay: number = 2000) => {
    const [state, setState] = useState<boolean>(false);

    const toggleState = () => {
        setState(true);
        setTimeout(() => {
            setState(false);
        }, delay);
    };

    return {
        state,
        toggleState,
    };
};

export default useToggleState;
