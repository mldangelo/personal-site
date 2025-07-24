const CHUNK_PUBLIC_PATH = "webpack-loaders.js";
const runtime = require("./build/chunks/[turbopack]_runtime.js");
runtime.loadChunk("build/chunks/[turbopack-node]_transforms_webpack-loaders_ts_cd6ed63b._.js");
runtime.loadChunk("build/chunks/[root-of-the-server]__8b1952d5._.js");
runtime.getOrInstantiateRuntimeModule("[turbopack-node]/globals.ts [webpack_loaders] (ecmascript)", CHUNK_PUBLIC_PATH);
runtime.getOrInstantiateRuntimeModule("[turbopack-node]/ipc/evaluate.ts/evaluate.js { INNER => \"[turbopack-node]/transforms/webpack-loaders.ts [webpack_loaders] (ecmascript)\", RUNTIME => \"[turbopack-node]/ipc/evaluate.ts [webpack_loaders] (ecmascript)\" } [webpack_loaders] (ecmascript)", CHUNK_PUBLIC_PATH);
module.exports = runtime.getOrInstantiateRuntimeModule("[turbopack-node]/ipc/evaluate.ts/evaluate.js { INNER => \"[turbopack-node]/transforms/webpack-loaders.ts [webpack_loaders] (ecmascript)\", RUNTIME => \"[turbopack-node]/ipc/evaluate.ts [webpack_loaders] (ecmascript)\" } [webpack_loaders] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
