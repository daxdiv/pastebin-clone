import type { IconType } from "react-icons";

interface ICopyToClipboardIconWrapperProps {
    action: () => void;
    Icon: IconType;
    text: string;
}

const CopyToClipboardIconWrapper = ({
    action,
    Icon,
    text,
}: ICopyToClipboardIconWrapperProps) => {
    return (
        <div className="group relative">
            <Icon
                className="cursor-pointer text-2xl rounded-md hover:scale-110 transition-all"
                onClick={action}
            />
            <div className="absolute top-8 left-[-1/2] translate-x-[-35%] group-hover:opacity-100 opacity-0 pointer-events-none transition-opacity text-xs border border-white rounded-md bg-cyan-800 w-24 py-1 px-2 text-center font-bold mx-auto">
                {text}
            </div>
        </div>
    );
};

export default CopyToClipboardIconWrapper;
