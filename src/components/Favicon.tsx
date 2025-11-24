import { useEffect, useState } from "react";

const Favicon = ({ label, url }: { label: string, url?: string }) => {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
    const firstLetter = label.charAt(0).toUpperCase();

    const [imageAvailable, setImageAvailable] = useState<boolean>(false);

    useEffect(() => {
        if (!url || url.length == 0) return;
        const image = new Image();

        image.src = faviconUrl;
        image.onload = () => setImageAvailable(true);
    }, [faviconUrl]); 

    return (
        <div className="favicon">
            <div className={"placeholder" + (imageAvailable ? " hidden" : "")}>
                {firstLetter}
            </div>

            {
                imageAvailable && 
                <img src={faviconUrl} alt="icon" className="icon"/>
            }
        </div>
    )
}

export default Favicon;