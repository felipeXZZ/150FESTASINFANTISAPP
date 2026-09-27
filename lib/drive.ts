/**
 * Link de download direto de um arquivo do Google Drive
 * (drive.google.com/file/d/ID/... ou ?id=ID). Pasta e links de fora do Drive
 * não têm download direto: voltam null e o popup mostra só "Abrir no Drive".
 */
export function linkDownloadDrive(url: string | null | undefined) {
  if (!url) return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (!u.hostname.endsWith("drive.google.com") && !u.hostname.endsWith("docs.google.com")) return null;
  if (u.pathname.includes("/folders/")) return null;

  const id = u.pathname.match(/\/file\/d\/([\w-]+)/)?.[1] ?? u.searchParams.get("id");
  if (!id) return null;
  return `https://drive.usercontent.google.com/download?id=${id}&export=download`;
}
