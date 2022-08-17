import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { VscCopy } from "react-icons/vsc";
import { BiLink } from "react-icons/bi";
import { env } from "../../env/client.mjs";
import CopyToClipboardIconWrapper from "../components/CopyToClipboardIconWrapper";
import useCopyState from "../../hooks/useCopyState";
import ErrorPage from "../error";

const Paste: NextPage = ({
    host,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { copied, toggleCopyState } = useCopyState();
    const router = useRouter();
    const {
        data: paste,
        isLoading,
        error,
    } = trpc.useQuery(["paste.get-by-id", { id: router.query.id as string }]);

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    if (error) return <div>Error: {error.message}</div>;
    if (isLoading)
        return <div className="font-bold text-white bg-gray-800">Loading...</div>;
    if (!paste) return <ErrorPage />;

    return (
        <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-800 text-white">
            <h1 className="font-bold mb-4 text-3xl">Your Paste</h1>
            <textarea
                rows={10}
                cols={50}
                value={paste?.text}
                className="p-2 bg-gray-700 border-2 border-white rounded-md"
                disabled
            ></textarea>
            <div className="flex gap-8 mt-4 text-white justify-center items-center">
                <CopyToClipboardIconWrapper
                    action={() => {
                        const text = paste?.text!;

                        handleCopyToClipboard(text);
                        toggleCopyState();
                    }}
                    Icon={VscCopy}
                    text="Copy text"
                />
                <CopyToClipboardIconWrapper
                    action={() => {
                        const url = `${host}/pastes/${router.query.id}`;

                        handleCopyToClipboard(url);
                        toggleCopyState();
                    }}
                    Icon={BiLink}
                    text="Copy link"
                />
            </div>
            {copied && (
                <code className="fixed bottom-8 flex justify-center font-bold text-sm">
                    Copied to Clipboard
                </code>
            )}
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {
            host: env.NEXT_PUBLIC_BASE_URL,
        }, // will be passed to the page component as props
    };
};

export default Paste;
