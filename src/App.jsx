import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, Eye, EyeOff, Github, Linkedin, Instagram, Mail } from "lucide-react";

export default function App() {
  const [text, setText] = useState(`{
  "hello": "This is Anshul Here",
  "arr": [1,2,3],
  "nested": {"a": true}
}`);
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState(null);
  const [collapsedPaths, setCollapsedPaths] = useState(new Set());
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("dark"); // default dark theme
  const [showTree, setShowTree] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const textRef = useRef(null);

  useEffect(() => {
    try {
      const p = JSON.parse(text);
      setParsed(p);
      setError(null);
    } catch (e) {
      setParsed(null);
      setError(e.message);
    }
  }, [text]);

  function formatJson() {
    try {
      const p = JSON.parse(text);
      setText(JSON.stringify(p, null, 2));
    } catch (e) {
      setError(e.message);
    }
  }

  function minifyJson() {
    try {
      const p = JSON.parse(text);
      setText(JSON.stringify(p));
    } catch (e) {
      setError(e.message);
    }
  }

  function validateJson() {
    try {
      JSON.parse(text);
      alert("Valid JSON ✅");
    } catch (e) {
      alert("Invalid JSON ❌: " + e.message);
    }
  }

  async function copyToClipboard() {
    if (!text || !text.trim()) {
      setCopyStatus("Nothing to copy");
      setTimeout(() => setCopyStatus(""), 1500);
      return;
    }
    setCopyStatus("Copying...");

    try {
      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(text);
        setCopyStatus("Copied ✅");
        setTimeout(() => setCopyStatus(""), 2000);
        return;
      }
    } catch (err) {}

    const fallbackSuccess = fallbackCopyText(text);
    if (fallbackSuccess) {
      setCopyStatus("Copied ✅ (fallback)");
      setTimeout(() => setCopyStatus(""), 2000);
      return;
    }
    setCopyStatus("Clipboard blocked ❌");
    setTimeout(() => setCopyStatus(""), 4000);
  }

  function fallbackCopyText(value) {
    try {
      const ta = document.createElement("textarea");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "0";
      ta.setAttribute("readonly", "");
      ta.value = value;
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(ta);
      return !!successful;
    } catch (e) {
      return false;
    }
  }

  function downloadJson() {
    try {
      const blob = new Blob([text], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError("Download failed: " + e.message);
    }
  }

  function uploadFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setText(String(reader.result));
    };
    reader.readAsText(f);
  }

  function toggleCollapse(path) {
    const next = new Set(collapsedPaths);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    setCollapsedPaths(next);
  }

  function isMatch(key, value) {
    if (!search) return true;
    const q = search.toLowerCase();
    const s = (String(key) + " " + JSON.stringify(value)).toLowerCase();
    return s.includes(q);
  }

  return (
    <div
      className={`min-h-screen flex flex-col p-4 sm:p-6 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100 scrollbar-dark"
          : "bg-gray-50 text-gray-900 scrollbar-light"
      }`}
    >
      <style>{`
        .scrollbar-light::-webkit-scrollbar { width: 10px; height: 10px; }
        .scrollbar-light::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }
        .scrollbar-dark::-webkit-scrollbar { width: 10px; height: 10px; }
        .scrollbar-dark::-webkit-scrollbar-thumb { background: #475569; border-radius: 6px; }
        .scrollbar-light { scrollbar-color: #cbd5e1 transparent; }
        .scrollbar-dark { scrollbar-color: #475569 transparent; }
      `}</style>

      <div className="max-w-7xl mx-auto flex-1 w-full">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h1 className="text-xl sm:text-2xl font-semibold">
            .JSON Viewer & Formatter
          </h1>
          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keys/values..."
              className={`flex-1 px-2 py-1 rounded border focus:outline-none text-sm sm:text-base
                ${
                  theme === "dark"
                    ? "bg-gray-800 text-white placeholder-gray-400 border-gray-600"
                    : "bg-white text-black placeholder-gray-500 border-gray-300"
                }`}
            />

            <button
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              className="px-3 py-1 rounded bg-blue-500 text-white flex items-center gap-1 text-sm"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              {theme === "light" ? "Dark" : "Light"}
            </button>

            <button
              onClick={() => setShowTree((s) => !s)}
              className="px-3 py-1 rounded bg-purple-500 text-white flex items-center gap-1 text-sm"
            >
              {showTree ? <EyeOff size={16} /> : <Eye size={16} />}
              {showTree ? "Hide Tree" : "Show Tree"}
            </button>
          </div>
        </header>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-2 items-center mb-3">
          <button className="flex-1 sm:flex-none px-3 py-1 rounded bg-green-600 text-white text-sm" onClick={formatJson}>
            Format
          </button>
          <button className="flex-1 sm:flex-none px-3 py-1 rounded bg-yellow-500 text-white text-sm" onClick={minifyJson}>
            Minify
          </button>
          <button className="flex-1 sm:flex-none px-3 py-1 rounded bg-indigo-600 text-white text-sm" onClick={validateJson}>
            Validate
          </button>
          <button
            onClick={copyToClipboard}
            className="flex-1 sm:flex-none px-3 py-1 rounded bg-gray-600 text-white flex items-center gap-2 text-sm"
          >
            <span>{copyStatus ? copyStatus : "Copy"}</span>
          </button>
          <button className="flex-1 sm:flex-none px-3 py-1 rounded bg-gray-700 text-white text-sm" onClick={downloadJson}>
            Download
          </button>
          <label className="flex-1 sm:flex-none px-3 py-1 rounded bg-blue-600 cursor-pointer text-sm text-center">
            Upload
            <input
              onChange={uploadFile}
              type="file"
              accept="application/json,.json,.txt"
              className="hidden"
            />
          </label>
        </div>

        {/* ERROR MESSAGE */}
        <div className="text-sm text-red-500 mb-2">
          {error ? `Error: ${error}` : null}
        </div>

        {/* MAIN CONTENT */}
        <main
          className={`grid gap-4 ${
            showTree ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* Editor */}
          <section>
            <label className="mb-2 font-medium block">JSON Input</label>
            <textarea
              ref={textRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={20}
              className={`w-full font-mono p-3 rounded border resize-none focus:outline-none text-sm sm:text-base
                ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-100 border-gray-700"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
            />
          </section>

          {/* Viewer */}
          {showTree && (
            <section>
              <label className="mb-2 font-medium block">Tree Viewer</label>
              <div
                className={`p-3 rounded border h-[300px] sm:h-[500px] overflow-auto text-sm sm:text-base
                  ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-300"
                  }`}
              >
                {parsed ? (
                  <JSONNode
                    data={parsed}
                    path={"root"}
                    collapsedPaths={collapsedPaths}
                    toggleCollapse={toggleCollapse}
                    isMatch={isMatch}
                  />
                ) : (
                  <div className="text-sm text-gray-400">
                    No valid JSON to show
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer
        className={`mt-6 py-4 border-t text-sm ${
          theme === "dark"
            ? "border-gray-700 text-gray-400"
            : "border-gray-300 text-gray-600"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <a href="https://anshul00.netlify.app/" target="_BLANCK">
            <p>
              Created with 🧑‍💻 by
              <span className={`font-semibold ml-2 ${theme === "dark" ? "text-white" : "text-black" }`}>
                 Anshul Chaurasiya
              </span>
            </p>
          </a>
          <div className="flex gap-4">
            <a
              href="https://github.com/anshul00000"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/anshul-chaurasiya-82243a25b/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://www.instagram.com/anshul._00/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="mailto:anshulchaurasiya05@gmail.com"
              className="hover:text-green-400 transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ========== JSON TREE RENDERER ========== */
function JSONNode({ data, path, collapsedPaths, toggleCollapse, isMatch }) {
  const type = getType(data);

  if (type === "object") {
    const keys = Object.keys(data);
    const isCollapsed = collapsedPaths.has(path);
    return (
      <div className="font-mono text-sm">
        <div>
          <button onClick={() => toggleCollapse(path)} className="mr-2">
            {isCollapsed ? "+" : "-"}
          </button>
          <span className="text-yellow-600">{`{ }`}</span>
        </div>
        {!isCollapsed && (
          <div className="ml-5">
            {keys.length === 0 && (
              <div className="text-gray-500">(empty object)</div>
            )}
            {keys.map((k) => (
              <div
                key={k}
                className={`mb-1 ${isMatch(k, data[k]) ? "" : "opacity-30"}`}
              >
                <span className="text-green-600">"{k}"</span>:{" "}
                <JSONNode
                  data={data[k]}
                  path={`${path}.${k}`}
                  collapsedPaths={collapsedPaths}
                  toggleCollapse={toggleCollapse}
                  isMatch={isMatch}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (type === "array") {
    const isCollapsed = collapsedPaths.has(path);
    return (
      <div className="font-mono text-sm">
        <div>
          <button onClick={() => toggleCollapse(path)} className="mr-2">
            {isCollapsed ? "+" : "-"}
          </button>
          <span className="text-yellow-600">[ ]</span>
        </div>
        {!isCollapsed && (
          <div className="ml-5">
            {data.length === 0 && (
              <div className="text-gray-500">(empty array)</div>
            )}
            {data.map((item, i) => (
              <div key={i} className="mb-1">
                <span className="text-blue-600">[{i}]</span>:{" "}
                <JSONNode
                  data={item}
                  path={`${path}[${i}]`}
                  collapsedPaths={collapsedPaths}
                  toggleCollapse={toggleCollapse}
                  isMatch={isMatch}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <Primitive value={data} />;
}

function Primitive({ value }) {
  const t = getType(value);
  let className = "";
  if (t === "string") className = "text-red-500";
  if (t === "number") className = "text-indigo-400";
  if (t === "boolean") className = "text-green-500";
  if (t === "null") className = "text-gray-500 italic";
  return <span className={className}>{formatPrimitive(value)}</span>;
}

function getType(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v === "object" ? "object" : typeof v;
}

function formatPrimitive(v) {
  if (v === null) return "null";
  if (typeof v === "string") return `"${v}"`;
  if (typeof v === "boolean") return v ? "true" : "false";
  return String(v);
}