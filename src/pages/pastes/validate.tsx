import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { env } from "../../env/client.mjs";
import useToggleState from "../../hooks/useToggleState";
import handleCopyToClipboard from "../../utils/copyToClipboard";

const Validate = ({ host }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { state: copyState, toggleState: toggleCopyState } = useToggleState(2000);
    const unlockMutation = trpc.useMutation("paste.unlock");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(unlockMutation.isLoading);
    const router = useRouter();

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (password === "") {
            setError("Please enter a password");

            return;
        }

        unlockMutation.mutate(
            { id: router.query.id as string, password },
            {
                onSuccess: () => router.push(`/pastes/${router.query.id}`),
                onError: ({ message }) => setError(message),
            }
        );
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-800 text-white">
            <p className="font-bold text-xl mb-4">Validate paste</p>
            <input
                type="text"
                className="appearance-none transition-opacity duration-200 bg-gray-700 border-2 px-2 py-1 text-sm border-white rounded-xl cursor-pointer"
                placeholder="Enter a password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            {error && <p className="my-2 text-red-500 font-bold">{error}</p>}

            <div className="flex justify-center items-center gap-2 mt-4">
                <button
                    className="font-bold px-2 py-1 cursor-pointer bg-cyan-700 border-2 border-white rounded-xl hover:scale-105 hover:bg-cyan-500 transition-all"
                    disabled={isLoading}
                    onClick={handleSubmit}
                >
                    Validate
                </button>
                <button
                    className="font-bold px-2 py-1 cursor-pointer bg-cyan-700 border-2 border-white rounded-xl hover:scale-105 hover:bg-cyan-500 transition-all"
                    onClick={() => {
                        const url = `${host}/pastes/${router.query.id}`;

                        handleCopyToClipboard(url);
                        toggleCopyState();
                    }}
                >
                    Copy link
                </button>
            </div>

            {copyState && (
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

export default Validate;
