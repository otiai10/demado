/// <reference types="node" />

import path from "path";
import fs from "fs/promises";
import { JSDOM } from "jsdom";
import { convert as fontconv } from "fontconv";

const PROJECT_ROOT = import.meta.url.replace("file://", "").split("/").slice(0, -2).join("/");
const default_target_folder = "src";
const default_scan_extensions = ["ts", "tsx", "js", "jsx"];
const unicode_reference_file_path = path.join(PROJECT_ROOT, "node_modules", "font-awesome", "scss", "_variables.scss");
const destination_fontfile_extensions = ["ttf", "woff", "woff2", "eot"];

const __main__ = async () => {

  console.log("[START] Minimizing fontawesome SVG file with icons actually used in the project");

  // Create static UNICODE dictionary
  const dictionary: { [name: string]: string } = {};
  const refs = await fs.readFile(unicode_reference_file_path, "utf-8");
  refs.split("\n").forEach((line) => {
    const match = line.match(/fa-var-(?<name>[a-z0-9-]+): "\\(?<unicode>[a-f0-9]+)"/);
    if (match?.groups?.name && match?.groups?.unicode) {
      dictionary[match.groups.name] = match.groups.unicode;
    }
  });
  console.log("  > Extracted icons from FontAwesome as UNICODE dictionary:", Object.keys(dictionary).length);

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
  console.log("  > Found icons used in the project:", Object.keys(summary).length);

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
      console.log("  [!] GLYPH NOT FOUND:", unicode, glyph);
    }
  });
  console.log("  > Glyphs to be saved:", glyphs.length);

  // Remove all glyphs
  const font: SVGElement = doc.window._document.querySelector("font");
  const allGlyphs = font.querySelectorAll("glyph");
  allGlyphs.forEach((g) => g.remove());
  console.log("  > Removed glyphs:", allGlyphs.length);
  // Insert only necessary glyphs
  font.append(...glyphs);

  // Backup old file
  // await fs.cp(svg_file_path, svg_file_path.replace(".svg", ".backup.svg"));

  // Save the file
  await fs.rm(svg_file_path, { force: true });
  const content = doc.serialize();
  await fs.writeFile(svg_file_path, content);

  console.log("  > Minimized fontawesome SVG file with icons:", glyphs.length);

  // Convert SVG to TTF, WOFF, WOFF2, EOT
  for (let i = 0; i < destination_fontfile_extensions.length; i++) {
    const ext = "." + destination_fontfile_extensions[i];
    const dest_content = await fontconv(content, ext, {});
    const dest_file = svg_file_path.replace(".svg", ext);
    await fs.rm(dest_file, { force: true });
    await fs.writeFile(dest_file, dest_content);
    console.log("  > Created font file:", path.basename(dest_file));
  }

  console.log("[DONE] Minimized fontawesome SVG file with icons actually used in the project");

}

__main__();
