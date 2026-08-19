const rows = Number(process.env.ROWS ?? 200000);
const users = Number(process.env.USERS ?? 50);
const pageSize = Number(process.env.PAGE_SIZE ?? 100);
const started = performance.now();
let rendered = 0;
for (let page = 0; page < Math.ceil(rows / pageSize); page += 1) {
  const start = page * pageSize;
  const end = Math.min(rows, start + pageSize);
  rendered += Math.min(70, end - start);
}
const elapsed = performance.now() - started;
console.log(JSON.stringify({ rows, users, pageSize, virtualizedRowsRendered: rendered, elapsedMs: Number(elapsed.toFixed(2)), note: "Synthetic harness; run against a staging database/API for production benchmark." }));
