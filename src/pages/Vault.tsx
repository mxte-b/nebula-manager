import Favicon from "../components/Favicon";
import { Entry } from "../types/general";
import Icons from "../components/Icons";
import EntryPasswordField from "../components/EntryPasswordField";

const Vault = ({ entries }: { entries: Entry[] | null }) => {

    

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
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {
                    entries &&
                    entries.map(e => 
                        <tr className="entry" key={e.id}>
                            <td>
                                <div className="entry-label">
                                    <Favicon label={e.label} url={e.url} />
                                    <span title={e.label}>{e.label}</span>
                                </div>
                            </td>

                            <td className="entry-name">
                                <span title={e.name}>{e.name}</span>
                            </td>

                            <td>
                                <EntryPasswordField password={e.password} />
                            </td>

                            <td className="entry-last-use">{e.createdAt.toLocaleDateString()}</td>

                            <td>
                                <div className="entry-actions">
                                    <div className="icon-hoverable">
                                        <Icons.PencilFill />
                                    </div>
                                    <div className="icon-hoverable">
                                        <Icons.TrashFill />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </>
    )
}

export default Vault;