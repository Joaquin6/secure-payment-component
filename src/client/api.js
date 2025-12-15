export const fetchUsername = async () => {
    const response = await fetch('/api/getUsername');
    const data = await response.json();
    return data;
};