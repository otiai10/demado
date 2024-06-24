import Mado from "../models/Mado";

export async function mados() {
  return { mados: await Mado.list() };
}
