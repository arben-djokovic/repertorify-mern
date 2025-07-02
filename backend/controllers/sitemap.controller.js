import Song from '../models/song.model.js';
import Playlist from '../models/playlist.model.js';


const generateSiteMapFile = async (req, res) => {
    try {
        const songs = await Song.find({});
        const playlists = await Playlist.find({});

        const baseUrl = 'https://repertorify.com';

        let urls = [];

        // Dodaj statične stranice
        urls.push(
            { url: '/', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 1.0 },
            { url: '/songs', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 0.8 },
            { url: '/playlists', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 0.8 },
            // dodaj ostale statične
        );

        // Dodaj sve pesme
        songs.forEach(song => {
            urls.push({
                url: `/songs/${song.slug || song._id}`,
                lastmod: song.updatedAt ? song.updatedAt.toISOString() : new Date().toISOString(),
                changefreq: 'weekly',
                priority: 0.7
            });
        });

        // Dodaj sve plejliste
        playlists.forEach(pl => {
            urls.push({
                url: `/playlists/${pl.slug || pl._id}`,
                lastmod: pl.updatedAt ? pl.updatedAt.toISOString() : new Date().toISOString(),
                changefreq: 'weekly',
                priority: 0.7
            });
        });

        // Kreiraj sitemap XML
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
                            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                            ${urls.map((u) => `<url>
                                <loc>${baseUrl}${u.url}</loc>
                                <lastmod>${u.lastmod}</lastmod>
                                <changefreq>${u.changefreq}</changefreq>
                                <priority>${u.priority}</priority>
                                </url>`).join('')}
                            </urlset>`;
        res.header('Content-Type', 'application/xml');
        res.send(sitemap);
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

export { generateSiteMapFile };