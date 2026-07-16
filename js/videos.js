// ============================================================
//  models/Video.js
//  Requêtes SQL pour la table videos.
// ============================================================

const { query } = require("../config/database");

const Video = {

async findAll({ categorie, premium, statut = "publié", limit = 50, offset = 0 } = {}) {
let sql = `SELECT * FROM videos WHERE statut = $1`;
const values = [statut];
let i = 2;

if (categorie) { sql += ` AND categorie = $${i++}`; values.push(categorie); }
if (premium !== undefined) { sql += ` AND premium = $${i++}`; values.push(premium); }

sql += ` ORDER BY created_at DESC LIMIT $${i++} OFFSET $${i++}`;
values.push(limit, offset);

const result = await query(sql, values);
return result.rows;

},

async findById(id) {
const result = await query("SELECT * FROM videos WHERE id = $1", [id]);
return result.rows[0] || null;
},

async create(data) {
// Extrait l'ID YouTube si non fourni
let youtubeId = data.youtube_id || null;
if (!youtubeId && data.url) {
const m = data.url.match(/(?:v=|youtu.be/)([a-zA-Z0-9_-]{11})/);
if (m) youtubeId = m[1];
}
const miniature = youtubeId
? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
: (data.miniature || null);

const result = await query(
  `INSERT INTO videos
     (titre, categorie, duree, url, youtube_id, miniature, description, premium, statut, vues)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
   RETURNING *`,
  [
    data.titre, data.categorie, data.duree, data.url,
    youtubeId, miniature, data.description,
    data.premium || false, data.statut || "publié",
    data.vues || 0,
  ]
);
return result.rows[0];

},

async update(id, data) {
const champs  = ["titre","categorie","duree","url","description","premium","statut"];
const updates = [];
const values  = [];
let i = 1;

for (const champ of champs) {
  if (data[champ] !== undefined) {
    updates.push(`${champ} = $${i++}`);
    values.push(data[champ]);
  }
}

// Recalcule youtube_id et miniature si URL modifiée
if (data.url) {
  const m = data.url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (m) {
    updates.push(`youtube_id = $${i++}`);
    values.push(m[1]);
    updates.push(`miniature = $${i++}`);
    values.push(`https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`);
  }
}

if (updates.length === 0) return null;
values.push(id);

const result = await query(
  `UPDATE videos SET ${updates.join(", ")} WHERE id = $${i} RETURNING *`,
  values
);
return result.rows[0];

},

async incrementerVues(id) {
await query("UPDATE videos SET vues = vues + 1 WHERE id = $1", [id]);
},

async delete(id) {
await query("DELETE FROM videos WHERE id = $1", [id]);
},

async count() {
const result = await query("SELECT COUNT(*) FROM videos");
return parseInt(result.rows[0].count, 10);
},
};

module.exports = Video;