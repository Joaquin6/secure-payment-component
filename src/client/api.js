export const fetchUsername = async () => {
    const response = await fetch('/api/username');
    const data = await response.json();
    return data;
};