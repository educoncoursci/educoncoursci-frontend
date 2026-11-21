// ============================================================
//  js/agenda.js — export d'agenda (.ics), entièrement côté navigateur.
//  Événements « journée entière » : date d'ouverture / de clôture d'un concours.
//  Aucune donnée n'est envoyée à un serveur.
// ============================================================
(function () {
  const jourOk = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v + "T00:00:00Z"));
  const compact = (v) => v.replace(/-/g, "");
  const echapper = (t) => String(t == null ? "" : t).replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  const plier = (l) => { const o = []; while (l.length > 73) { o.push(l.slice(0, 73)); l = " " + l.slice(73); } o.push(l); return o.join("\r\n"); };
  const lendemain = (v) => { const d = new Date(v + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); };

  /** @param {{id,titre,organisme,date_ouverture,date_cloture}[]} concours */
  function evenements(concours) {
    const ev = [];
    for (const c of concours || []) {
      const org = c.organisme ? " — " + c.organisme : "";
      const note = "Vérifiez les dates sur la source officielle avant de postuler. Fiche : " + location.origin + "/concours-detail.html?id=" + encodeURIComponent(c.id);
      if (jourOk(c.date_ouverture)) ev.push({ uid: `ouv-${c.id}`, jour: c.date_ouverture, titre: "Ouverture : " + c.titre + org, note });
      if (jourOk(c.date_cloture)) ev.push({ uid: `clo-${c.id}`, jour: c.date_cloture, titre: "Clôture : " + c.titre + org, note });
    }
    return ev;
  }

  function construire(ev) {
    const maintenant = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const l = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ProInsertion CI//Concours//FR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
    for (const e of ev) {
      l.push("BEGIN:VEVENT", `UID:${e.uid}@proinsertionci`, `DTSTAMP:${maintenant}`,
        `DTSTART;VALUE=DATE:${compact(e.jour)}`, `DTEND;VALUE=DATE:${compact(lendemain(e.jour))}`,
        plier("SUMMARY:" + echapper(e.titre)), plier("DESCRIPTION:" + echapper(e.note)),
        "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:Rappel", "TRIGGER:-P3D", "END:VALARM", "END:VEVENT");
    }
    l.push("END:VCALENDAR");
    return l.join("\r\n") + "\r\n";
  }

  /** Télécharge le fichier ; retourne le nombre d'événements (0 = rien à exporter). */
  function telecharger(concours, nomFichier) {
    const ev = evenements(concours);
    if (!ev.length) return 0;
    const blob = new Blob([construire(ev)], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (nomFichier || "concours") + ".ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    return ev.length;
  }

  window.Agenda = { evenements, construire, telecharger };
})();
