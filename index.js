import { PGlite } from "@electric-sql/pglite";
import { writeFileSync, readFileSync, rmSync } from "fs";

const dataDir = "data";
const noneFile = "archive.none";
const gzipFile = "archive.gzip";

rmSync(dataDir, { recursive: true, force: true });
rmSync(noneFile, { force: true });
rmSync(gzipFile, { force: true });

const db = new PGlite({ dataDir });

await db.exec(`
  CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT);
  INSERT INTO test (id, name) VALUES (1, 'test');
  INSERT INTO test (id, name) VALUES (2, 'test2');
`);

const noneArrayBuffer = await db
  .dumpDataDir("none")
  .then((r) => r.arrayBuffer());
writeFileSync(noneFile, Buffer.from(noneArrayBuffer));

const gzipArrayBuffer = await db
  .dumpDataDir("gzip")
  .then((r) => r.arrayBuffer());
writeFileSync(gzipFile, Buffer.from(gzipArrayBuffer));

await db.close();

const noneLoadDataDir = new Blob([readFileSync(noneFile)]);
const noneDb = new PGlite({ loadDataDir: noneLoadDataDir });
const noneResult = await noneDb.query("SELECT * FROM test");
console.log(noneResult.rows);
await noneDb.close();

const gzipLoadDataDir = new Blob([readFileSync(gzipFile)]);
const gzipDb = new PGlite({ loadDataDir: gzipLoadDataDir });
const gzipResult = await gzipDb.query("SELECT * FROM test");
console.log(gzipResult.rows);
await gzipDb.close();
