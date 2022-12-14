import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { VscCopy } from "react-icons/vsc";
import { BiLink } from "react-icons/bi";
import { env } from "../../env/client.mjs";
import CopyToClipboardIconWrapper from "../../components/CopyToClipboardIconWrapper";
import useToggleState from "../../hooks/useToggleState";
import ErrorPage from "../error";
import handleCopyToClipboard from "../../utils/copyToClipboard";
import { useEffect } from "react";

type PasteProps = {
  host: string;
};

const Paste: NextPage<PasteProps> = ({ host }) => {
  const { state: copyState, toggleState: toggleCopyState } = useToggleState(2000);
  const router = useRouter();
  const {
    data: paste,
    isLoading,
    error,
  } = trpc.useQuery(["paste.get-by-id", { id: router.query.id as string }], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading)
    return <div className="font-bold text-white bg-gray-800">Loading...</div>;
  if (!paste) return <ErrorPage />;

  useEffect(() => {
    if (paste.locked) {
      router.push({
        pathname: "/pastes/validate",
        query: { id: paste.id },
      });
    }
  });

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-800 text-white">
      {!paste.locked && (
        <>
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
                const text = paste.text;

                handleCopyToClipboard(text);
                toggleCopyState();
              }}
              Icon={VscCopy}
              text="Copy text"
            />
            <CopyToClipboardIconWrapper
              action={() => {
                const url = `${host}/pastes/${paste.id}`;

                handleCopyToClipboard(url);
                toggleCopyState();
              }}
              Icon={BiLink}
              text="Copy link"
            />
          </div>
          {copyState && (
            <code className="fixed bottom-8 flex justify-center font-bold text-sm">
              Copied to Clipboard
            </code>
          )}
        </>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const props: PasteProps = {
    host: env.NEXT_PUBLIC_BASE_URL,
  };

  return {
    props, // will be passed to the page component as props
  };
};

export default Paste;
