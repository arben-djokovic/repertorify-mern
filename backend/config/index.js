
import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const SONGS_PER_PAGE = process.env.SONGS_PER_PAGE;
export const PLAYLISTS_PER_PAGE = process.env.PLAYLISTS_PER_PAGE;
export const NODE_ENV = process.env.NODE_ENV


const createDiacriticRegex = (str) => {
    const map = {
        a: "[aàáâãäåāą]",
        c: "[cčćç]",
        d: "[dđ]",
        dj: "[djđ]",
        e: "[eèéêëēėę]",
        i: "[iìíîïīį]",
        n: "[nñń]",
        o: "[oòóôõöōø]",
        s: "[sšśş]",
        u: "[uùúûüū]",
        y: "[yÿ]",
        z: "[zžźż]",
        č: "[cčćç]",
        đ: "[djđ]",
        ć: "[cčćç]",
        š: "[sšśş]",
        ž: "[zžźż]"
    };

    return str
        .split("")
        .map((char) => {
            const lowerChar = char.toLowerCase();
            return map[lowerChar] || (lowerChar === "đ" ? "[dđ]" : char);
        })
        .join("");
};

export { createDiacriticRegex };