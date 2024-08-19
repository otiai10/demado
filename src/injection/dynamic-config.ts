/// <reference types="chrome" />

/**
 * アセットサイズが大きくなるので、importはtypeあるいは最低限のconstのみにする
 */
import type { MadoPortableObject } from "../models/Mado";

(async () => {

  const SPACING = 6;

  const c = JSON.parse(sessionStorage.getItem("demado_default_config_value") || "{}") as MadoPortableObject;

  console.log("[IFNO] Dynamic Config is running");
  const overlay = document.createElement("div");
  overlay.id = "demado-dynamic-config-overlay";
  overlay.style.position = "fixed";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  document.body.appendChild(overlay);

  const container = document.createElement("div");
  container.id = "demado-dynamic-config-container";
  container.style.width = "80vw";
  container.style.height = "80vh";
  container.style.overflowY = "scroll";
  container.style.backgroundColor = "rgba(200,200,200, 0.6)";
  container.style.borderRadius = `${SPACING * 2}px`;
  container.style.padding = `${SPACING * 3}px`;
  // container.style.fontWeight = "bold";
  container.style.fontSize = "1rem";
  container.style.color = "rgb(41, 29, 0)";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  overlay.appendChild(container);

  const head = document.createElement("div");
  container.appendChild(head);

  const title = document.createElement("h1");
  title.textContent = "demado 画面内設定";
  title.style.color = "white";
  title.style.fontSize = "1rem";
  title.style.marginBottom = `${SPACING * 2}px`;
  head.appendChild(title);

  const body = document.createElement("div");
  body.style.flex = "1";
  container.appendChild(body);

  // {{{ サイズ
  const sizegroup = __CREATE_GROUP__();
  body.appendChild(sizegroup);
  const [width, , widthinput] = __CREATE_FILED__("横幅", c.size?.width || window.innerWidth);
  sizegroup.appendChild(width);
  const [height, , heightinput] = __CREATE_FILED__("高さ", c.size?.height || window.innerHeight);
  sizegroup.appendChild(height);
  // }}}

  // {{ オフセット
  const offsetgroup = __CREATE_GROUP__();
  body.appendChild(offsetgroup);
  const [left, , leftinput] = __CREATE_FILED__("左右方向", c.offset?.left || 0);
  leftinput.addEventListener("change", (ev) => {
    const value = parseInt((ev.target as HTMLInputElement).value);
    document.body.style.left = `${value}px`;
  });
  offsetgroup.appendChild(left);
  const [top, , topinput] = __CREATE_FILED__("上下方向", c.offset?.top || 0);
  topinput.addEventListener("change", (ev) => {
    const value = parseInt((ev.target as HTMLInputElement).value);
    document.body.style.top = `${value}px`;
  });
  offsetgroup.appendChild(top);
  // }}}

  // {{{ ズーム
  const zoomgroup = __CREATE_GROUP__();
  body.appendChild(zoomgroup);
  const [zoom, , zoominput] = __CREATE_FILED__("ズーム", c.zoom || 1);
  zoominput.step = "0.05";
  zoominput.min = "0.1";
  zoominput.addEventListener("change", (ev) => {
    const value = parseFloat((ev.target as HTMLInputElement).value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (document.body.style as any).zoom = `${value}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (overlay.style as any).zoom = `${1 / value}`;
  });
  zoomgroup.appendChild((() => { const x = document.createElement("div"); x.style.flex = "1"; return x; })());
  zoomgroup.appendChild(zoom);
  // }}}

  const foot = document.createElement("div");
  container.appendChild(foot);

  const commit = document.createElement("div");
  commit.style.padding = `${SPACING}px ${SPACING * 2}px`;
  commit.style.borderRadius = `${SPACING}px`;
  commit.style.backgroundColor = "rgb(255, 183, 15)";
  commit.style.cursor = "pointer";
  commit.style.textAlign = "center";
  commit.textContent = "これでよし。設定画面に戻る";
  commit.addEventListener("click", () => {
    chrome.runtime.sendMessage({
      action: "/mado/dynamic-config:result",
      mado: sessionStorage.getItem(`demado_${chrome.runtime.id}_id`),
      params: {
        size: {
          width: parseInt(widthinput.value),
          height: parseInt(heightinput.value),
        },
        offset: {
          left: parseInt(leftinput.value),
          top: parseInt(topinput.value),
        },
        zoom: parseFloat(zoominput.value),
      },
    }, () => {
      window.close();
    })
  });
  foot.appendChild(commit);

  window.onresize = () => {
    widthinput.value = `${window.innerWidth}`;
    heightinput.value = `${window.innerHeight}`;
  };

  console.log("[INFO] Overlay created");

  function __CREATE_GROUP__(): HTMLDivElement {
    const div= document.createElement("div");
    div.style.display = "flex";
    div.style.flexFlow = "row wrap";
    div.style.gap = `${SPACING}px`;
    return div;
  }

  function __CREATE_FILED__(lablname: string, value: number): [HTMLDivElement, HTMLLabelElement, HTMLInputElement] {
    const field = document.createElement("div");
    field.style.flex = "1";
    field.style.display = "flex";
    field.style.gap = `${SPACING/2}px`;
    field.style.alignItems = "center";
    field.style.flexFlow = "row wrap";
    field.style.marginBottom = `${SPACING * 2}px`;
    field.style.minWidth = "200px";

    const label = document.createElement("label");
    label.textContent = lablname;
    label.style.flex = "1";
    label.style.textAlign = "right";
    field.appendChild(label);

    const input = document.createElement("input");
    input.type = "number";
    input.style.width = "50%";
    input.value = `${value}`;
    input.step = `1`;
    field.appendChild(input);

    return [field, label, input];
  }

})();
