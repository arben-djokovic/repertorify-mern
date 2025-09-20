
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

  const chordRegex =
    /(?<!\S)([A-GH](#|b)?(?:maj|min|m|m7|maj7|dim|dim7|aug|sus2|sus4|add9|add11|7|6|9|11|13)?(?:\/[A-GH](#|b)?)?)(?!\S)/g;
  const chordMap = {
    C: 0,
    "C#": 1,
    D: 2,
    "D#": 3,
    E: 4,
    F: 5,
    "F#": 6,
    G: 7,
    "G#": 8,
    A: 9,
    B: 10,
    H: 11,
  };
  const transposeChord = (chord, semitones) => {
    const rootMatch = chord.match(/^([A-GH](#|b)?)/);
    if (!rootMatch) return chord;

    const root = rootMatch[0];
    const suffix = chord.substring(root.length);
    const currentVal = chordMap[root];

    if (currentVal === undefined) return chord;

    const transposedVal = (currentVal + semitones + 12) % 12;
    const transposedRoot = reverseChordMap[transposedVal];

    return transposedRoot + suffix;
  };
    const reverseChordMap = Object.fromEntries(
    Object.entries(chordMap).map(([chord, value]) => [value, chord])
  );
  
export { createDiacriticRegex, chordRegex, transposeChord, reverseChordMap, chordMap };