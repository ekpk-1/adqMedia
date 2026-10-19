const SITE = "https://adqmedia.au";
const font = "Arial, Helvetica, sans-serif";

export function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function link(href, text, color) {
    return `<a href="${escapeHtml(href)}" style="color:${color};text-decoration:underline;">${escapeHtml(text)}</a>`;
}

function paragraph(text) {
    return `<p style="margin:0 0 16px;font:16px/26px ${font};color:#ffffff;">${escapeHtml(text)}</p>`;
}

function factRow(fact) {
    const value = fact.href ? link(fact.href, fact.text, "#ffffff") : escapeHtml(fact.text);
    return `<tr>
<td style="padding:16px 0 0;">
<div style="font:11px/16px ${font};letter-spacing:0.14em;text-transform:uppercase;color:#9f9f9f;">${escapeHtml(fact.label)}</div>
<div style="padding-top:4px;font:16px/24px ${font};color:#ffffff;">${value}</div>
</td>
</tr>`;
}

function noteBlock(label, text) {
    const body = escapeHtml(text).replace(/\n/g, "<br>");
    return `<tr><td style="height:28px;font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td bgcolor="#1a1a1a" style="padding:20px;background:#1a1a1a;background-image:linear-gradient(#1a1a1a,#1a1a1a);font:11px/16px ${font};letter-spacing:0.14em;text-transform:uppercase;color:#9f9f9f;">${escapeHtml(label)}
<div style="padding-top:12px;font:16px/26px ${font};letter-spacing:0;text-transform:none;color:#ffffff;">${body}</div>
</td></tr>`;
}

/** Dark HTML email. Table layout, inline styles, so it holds up in mail clients. */
export function renderMail({ preheader, eyebrow, title, lines, facts, noteLabel, note }) {
    const factRows = (facts ?? []).filter((fact) => fact?.text).map(factRow).join("");
    const factsTable = factRows ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${factRows}</table>` : "";
    const noteHtml = note ? noteBlock(noteLabel, note) : "<tr><td></td></tr>";
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${escapeHtml(title)}</title>
<style>
.column { width: 560px !important; }
@media only screen and (max-width: 600px) {
.column { width: 100% !important; max-width: 100% !important; }
}
</style>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;background-image:linear-gradient(#0f0f0f,#0f0f0f);">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;background-image:linear-gradient(#0f0f0f,#0f0f0f);">
<tr><td align="center" style="padding:32px 16px;">
<table class="column" role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:560px;">
<tr><td style="padding:0 0 28px;border-bottom:3px solid #bf1e2e;">
<span style="font:700 28px/32px ${font};letter-spacing:0.06em;color:#ffffff;">ADQ</span><span style="display:inline-block;width:7px;height:7px;margin-left:3px;background:#bf1e2e;background-image:linear-gradient(#bf1e2e,#bf1e2e);border-radius:7px;font-size:7px;line-height:7px;vertical-align:top;">&nbsp;</span>
</td></tr>
<tr><td style="padding:28px 0 0;font:11px/16px ${font};letter-spacing:0.14em;text-transform:uppercase;color:#9f9f9f;">${escapeHtml(eyebrow)}</td></tr>
<tr><td style="padding:8px 0 20px;font:32px/38px ${font};color:#ffffff;">${escapeHtml(title)}</td></tr>
<tr><td>${(lines ?? []).map(paragraph).join("")}</td></tr>
<tr><td>${factsTable}</td></tr>
${noteHtml}
<tr><td style="padding:32px 0 0;font:13px/20px ${font};color:#9f9f9f;">${link(SITE, "adqmedia.au", "#9f9f9f")}<br>Melbourne</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
