import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const Paste: NextPage = () => {
    const router = useRouter();
    const {
        data: paste,
        isLoading,
        error,
    } = trpc.useQuery(["paste.get-by-id", { id: router.query.id as string }]);

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
        </div>
    );
};

export default Paste;
