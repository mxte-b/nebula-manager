const normalizeUrl = (url: string) => {
    return /^(https?:)?\/\//.test(url) ? url : `https://${url}`;
}

export default normalizeUrl;