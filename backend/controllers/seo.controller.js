import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Song from "../models/song.model.js";
import Playlist from "../models/playlist.model.js";

// Express serves the React build for every page, so without this Google sees the same
// empty HTML shell (same title, no canonical, empty #root) for every URL and treats
// song/playlist pages as duplicates. Here the head tags and the main content are
// injected into index.html before it is sent.
//
// Head tags carry data-rh="true" so react-helmet-async replaces them on the client
// instead of duplicating them. React's createRoot clears #root, so the injected
// content is only what crawlers see before the app renders.

const BASE_URL = "https://repertorify.com";
const DEFAULT_TITLE = "Repertorify – Najbolje pjesme sa akordima";
const DEFAULT_DESCRIPTION = "Pronađi omiljene pjesme sa akordima, lako ih prilagodi i uživaj u sviranju uz Repertorify.";

const indexPath = path.resolve("frontend", "build", "index.html");
let indexHtml = null;
const getIndexHtml = () => {
    if (!indexHtml) indexHtml = fs.readFileSync(indexPath, "utf8");
    return indexHtml;
};

const escapeHtml = (str) => String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const renderPage = ({ title = DEFAULT_TITLE, description = DEFAULT_DESCRIPTION, canonical, noindex = false, body = "" }) => {
    const head = [
        `<title>${escapeHtml(title)}</title>`,
        `<meta data-rh="true" name="description" content="${escapeHtml(description)}"/>`,
        `<meta data-rh="true" property="og:title" content="${escapeHtml(title)}"/>`,
        `<meta data-rh="true" property="og:description" content="${escapeHtml(description)}"/>`,
        canonical && `<meta data-rh="true" property="og:url" content="${escapeHtml(canonical)}"/>`,
        canonical && `<link data-rh="true" rel="canonical" href="${escapeHtml(canonical)}"/>`,
        noindex && `<meta data-rh="true" name="robots" content="noindex"/>`,
    ].filter(Boolean).join("");

    return getIndexHtml()
        .replace(/<title>[\s\S]*?<\/title>/, head)
        .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
};

// Crawlers read this markup, but users would see it unstyled for a moment before React
// replaces it, so it is visually hidden (still in the DOM, unlike display:none)
const SEO_MAIN_OPEN = '<main style="position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">';

const songDescription = (song) => `"${song.title}" od ${song.artist} sa akordima i tekstom na Repertorify. Lako promijeni tonalitet i dodaj u svoj repertoar.`;

// /songs/:id and /playlists/:playlistId/songs/:id both point to the canonical /songs/:id
const renderSong = async (req, res) => {
    const { id } = req.params;
    const song = mongoose.isValidObjectId(id) ? await Song.findById(id).select("title artist text") : null;
    if (!song) return res.status(404).send(renderPage({ title: "Stranica nije pronađena | Repertorify", noindex: true }));

    const title = `${song.title} - ${song.artist} Akordi i Tekst | Repertorify`;
    const body = `${SEO_MAIN_OPEN}<h1>${escapeHtml(song.title)}</h1><h2>${escapeHtml(song.artist)}</h2><pre>${escapeHtml(song.text)}</pre></main>`;
    res.send(renderPage({ title, description: songDescription(song), canonical: `${BASE_URL}/songs/${song._id}`, body }));
};

const renderPlaylist = async (req, res) => {
    const { id } = req.params;
    const playlist = mongoose.isValidObjectId(id) ? await Playlist.findById(id).select("name isPublic songs").populate("songs", "title artist") : null;
    if (!playlist) return res.status(404).send(renderPage({ title: "Stranica nije pronađena | Repertorify", noindex: true }));
    if (!playlist.isPublic) return res.send(renderPage({ title: "Plejlista | Repertorify", noindex: true }));

    const title = `${playlist.name} plejlista | Repertorify`;
    const description = `Pregledaj plejlistu ${playlist.name} koja sadrži pjesme sa akordima na Repertorify.`;
    const songLinks = playlist.songs
        .map(song => `<li><a href="/songs/${song._id}">${escapeHtml(song.title)} - ${escapeHtml(song.artist)}</a></li>`)
        .join("");
    const body = `${SEO_MAIN_OPEN}<h1>${escapeHtml(playlist.name)}</h1><ul>${songLinks}</ul></main>`;
    res.send(renderPage({ title, description, canonical: `${BASE_URL}/playlists/${playlist._id}`, body }));
};

// "/" and "/songs" show the same song list: page 1 is canonical on "/", later pages keep ?page=N
const songListCanonical = (req) => {
    const page = parseInt(req.query.page);
    return page > 1 ? `${BASE_URL}/songs?page=${page}` : `${BASE_URL}/`;
};

// Every other page: keep the default head, but give it a canonical without query string
const renderDefault = (req, res) => {
    const pathname = req.path.replace(/\/+$/, "") || "/";
    const canonical = pathname === "/" || pathname === "/songs" ? songListCanonical(req) : `${BASE_URL}${pathname}`;
    res.send(renderPage({ canonical }));
};

const withErrors = (handler) => async (req, res) => {
    try {
        await handler(req, res);
    } catch (err) {
        console.error(err);
        res.send(getIndexHtml());
    }
};

const seoRenderSong = withErrors(renderSong);
const seoRenderPlaylist = withErrors(renderPlaylist);
const seoRenderDefault = withErrors(renderDefault);

export { seoRenderSong, seoRenderPlaylist, seoRenderDefault };
