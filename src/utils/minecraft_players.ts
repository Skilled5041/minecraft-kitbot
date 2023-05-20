export const usernameToUUID = async (username: string): Promise<string | null> => {
    const data = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    const json = await data.json();
    if (!json.id) return null;
    return json.id;
};
