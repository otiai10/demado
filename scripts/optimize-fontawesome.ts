/// <reference types="node" />

import path from "path";
import fs from "fs/promises";
import { JSDOM } from "jsdom";
import { convert as fontconv } from "fontconv";

// {{{ JUST FOR COLORIZING LOG: import { styleText as style } from "node:util";
const color = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  // Dim: "\x1b[2m",
  // Underscore: "\x1b[4m",
  // Blink: "\x1b[5m",
  // Reverse: "\x1b[7m",
  // Hidden: "\x1b[8m",
  // FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  // FgBlue: "\x1b[34m",
  // FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  // FgWhite: "\x1b[37m",
  // FgGray: "\x1b[90m",
  // BgBlack: "\x1b[40m",
  // BgRed: "\x1b[41m",
  // BgGreen: "\x1b[42m",
  // BgYellow: "\x1b[43m",
  // BgBlue: "\x1b[44m",
  // BgMagenta: "\x1b[45m",
  // BgCyan: "\x1b[46m",
  // BgWhite: "\x1b[47m",
  // BgGray: "\x1b[100m",
}
/* eslint-disable */
const info = (...args: any[]) => console.log(`${color.FgCyan}${args[0]}${color.Reset}`, ...args.slice(1));
const warn = (...args: any[]) => console.log(`${color.Bright}${color.FgYellow}${args[0]}${color.Reset}`, ...args.slice(1));
/* eslint-enable */
// }}}

const PROJECT_ROOT = import.meta.url.replace("file://", "").split("/").slice(0, -2).join("/");
const default_target_folder = "src";
const default_scan_extensions = ["ts", "tsx", "js", "jsx"];
const unicode_reference_file_path = path.join(PROJECT_ROOT, "node_modules", "font-awesome", "scss", "_variables.scss");
const destination_fontfile_extensions = ["ttf", "woff", "woff2", "eot"];

const __main__ = async () => {

  info("[START]", `Minimizing fontawesome SVG file with icons actually used in the project`);

  // Create static UNICODE dictionary
  const dictionary: { [name: string]: string } = {};
  const refs = await fs.readFile(unicode_reference_file_path, "utf-8");
  refs.split("\n").forEach((line) => {
    const match = line.match(/fa-var-(?<name>[a-z0-9-]+): "\\(?<unicode>[a-f0-9]+)"/);
    if (match?.groups?.name && match?.groups?.unicode) {
      dictionary[match.groups.name] = match.groups.unicode;
    }
  });
  info("  > ", "Extracted icons from FontAwesome as UNICODE dictionary:", Object.keys(dictionary).length);

  // Find all font-awesome icons in the project
  const target_folder_path = path.join(PROJECT_ROOT, default_target_folder);
  const entries = await fs.readdir(target_folder_path, { recursive: true });
  const summary: { [name: string]: { glyph: string, unicode: string, apperance: { file: string, line: number }[] } } = {};
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const ext = e.split(".").pop() || "";
    if (!default_scan_extensions.includes(ext)) continue;
    const file_path = path.join(target_folder_path, e);
    const contens = await fs.readFile(file_path, "utf-8");
    contens.split("\n").forEach((line, line_number) => {
      const match = line.matchAll(/fa[ ]+fa-(?<name>[a-z0-9-]+)/g);
      for (const m of match) {
        if (m.groups?.name) {
          summary[m.groups.name] = summary[m.groups.name] || {
            glyph: m.groups.name.replace(/-/g, "_"), unicode: dictionary[m.groups.name],
            apperance: [],
          };
          summary[m.groups.name].apperance.push({ file: file_path, line: line_number });
        }
      }
    });
  }
  info("  > ", "Found icons used in the project:", Object.keys(summary).length);

  // Open SVG file and remove all the unnecessary lines except for the keys in the summary
  const svg_file_path = path.join(PROJECT_ROOT, "dist", "assets", "fontawesome-webfont.svg");
  const doc: JSDOM = await JSDOM.fromFile(svg_file_path);
  const glyphs: SVGElement[] = [];
  Object.values(summary).forEach(({ glyph, unicode }) => {
    const node: SVGAElement = doc.window._document.querySelector(`glyph[glyph-name=${glyph}]`)
      || doc.window._document.querySelector(`glyph[unicode="\\${unicode}"]`);
    if (node) {
      glyphs.push(node as SVGElement);
    } else {
      warn("  [!] ", "GLYPH NOT FOUND: ", unicode, glyph);
    }
  });
  info("  > ", "Glyphs to be saved:", glyphs.length);

  // Remove all glyphs
  const font: SVGElement = doc.window._document.querySelector("font");
  const allGlyphs = font.querySelectorAll("glyph");
  allGlyphs.forEach((g) => g.remove());
  info("  > ", "Removed glyphs:", allGlyphs.length);
  // Insert only necessary glyphs
  font.append(...glyphs);

  // Backup old file
  // await fs.cp(svg_file_path, svg_file_path.replace(".svg", ".backup.svg"));

  // Save the file
  await fs.rm(svg_file_path, { force: true });
  const content = doc.serialize();
  await fs.writeFile(svg_file_path, content);

  info("  > ", "Minimized fontawesome SVG file with icons:", glyphs.length);

  // Convert SVG to TTF, WOFF, WOFF2, EOT
  for (let i = 0; i < destination_fontfile_extensions.length; i++) {
    const ext = "." + destination_fontfile_extensions[i];
    const dest_content = await fontconv(content, ext, {});
    const dest_file = svg_file_path.replace(".svg", ext);
    await fs.rm(dest_file, { force: true });
    await fs.writeFile(dest_file, dest_content);
    info("  > ", "Created font file:", path.basename(dest_file));
  }
  info("[DONE]", "Minimized fontawesome SVG file with icons actually used in the project\n");
}

__main__();
