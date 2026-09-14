#!/usr/bin/env node
/**
 * Genera public/og.png en 1200x630 (el tamaño estandar de OpenGraph, ver
 * AGENTS.md #4) a partir de la imagen fuente que ya esta en esa misma ruta.
 *
 * Las proporciones de la fuente no coinciden con las del objetivo, asi que
 * recorta de forma centrada (cover/center) en vez de deformar la imagen:
 * el logo queda encuadrado, sin bordes ni estiramiento.
 *
 * Como correrlo (para regenerar el OG si cambia el diseño/logo, se
 * reemplaza public/og.png por la nueva fuente y se vuelve a correr esto):
 *
 *   pnpm exec node scripts/og.generate.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OG_IMAGE_PATH = path.join(__dirname, "..", "public", "og.png");
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

async function main() {
  const sourceBuffer = await readFile(OG_IMAGE_PATH);

  const outputBuffer = await sharp(sourceBuffer)
    .resize(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, {
      fit: "cover",
      position: "centre",
    })
    .png()
    .toBuffer();

  await writeFile(OG_IMAGE_PATH, outputBuffer);

  const { width, height } = await sharp(outputBuffer).metadata();
  console.log(`public/og.png generado: ${width}x${height}`);
}

main();
