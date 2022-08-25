const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
};

export default handleCopyToClipboard;
