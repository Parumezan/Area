import fs from "fs";
import path from "path";

export default function DownloadPage() {
  return null;
}

export async function getServerSideProps({ res }) {
  const filePath = path.join(process.cwd(), "build", "app-release.apk");

  await fs.promises.stat(filePath);

  res.setHeader("Content-Type", "application/vnd.android.package-archive");
  res.setHeader("Content-Disposition", "attachment; filename=app-release.apk");
  fs.createReadStream(filePath).pipe(res);

  return { props: {} };
}
