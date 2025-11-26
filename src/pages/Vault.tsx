import { useEffect } from "react";
import Favicon from "../components/Favicon";
import { Entry } from "../types/general";

const Vault = ({ entries }: { entries: Entry[] | null }) => {

    useEffect(() => {
        console.log(entries);
    }, []);
    return (
        <>
            <header>My passwords</header>
            <table className="entries" cellSpacing={0}>
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>Name</th>
                        <th>Password</th>
                        <th>Last Used</th>
                    </tr>
                </thead>
                <tbody>
                {
                    entries &&
                    entries.map(e => 
                        <tr className="entry" key={e.id}>
                            <td>
                                <div  className="entry-label">
                                    <Favicon label={e.label} url={e.url} />
                                    <span>{e.label}</span>
                                </div>
                            </td>
                            <td className="entry-name">{e.name}</td>
                            <td className="entry-password">••••••••••</td>
                            <td className="entry-last-use">{e.createdAt}</td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </>
    )
}

export default Vault;