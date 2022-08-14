import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { VscCopy } from "react-icons/vsc";
import { BiLink } from "react-icons/bi";
import { env } from "../../env/client.mjs";

const Paste: NextPage = ({
    host,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const {
        data: paste,
        isLoading,
        error,
    } = trpc.useQuery(["paste.get-by-id", { id: router.query.id as string }]);

    const handleCopyToClipBoard = (text: string) => {
        navigator.clipboard.writeText(text);

        console.log("Copied to clipboard", text);
    };

    if (isLoading)
        return <div className="font-bold text-white bg-gray-800">Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

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
            <div className="flex gap-2 mt-4 text-white justify-center items-center">
                <VscCopy
                    className="cursor-pointer text-2xl rounded-md hover:scale-110 transition-all"
                    onClick={() =>
                        handleCopyToClipBoard(
                            `${host}/pastes/${router.query.id as string}`
                        )
                    }
                />
                <BiLink className="cursor-pointer text-2xl rounded-md hover:scale-110 transition-all" />
            </div>
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
