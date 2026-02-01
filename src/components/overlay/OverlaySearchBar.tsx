import Icons from "../Icons";

const OverlaySearchBar = ({ onSearch }: { onSearch: (query: string) => void}) => {
    return (
        <div className="search">
            <Icons.MagnifyingGlass />
            <input
                autoComplete="off"
                placeholder="Search for a password..."
                type="text"
                autoFocus
                name="query"
                id="query"
                onChange={(e) => {
                    onSearch(e.target.value);
                }}
            />
        </div>
    );
}

export default OverlaySearchBar;