import { promises as fs } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

export const draw = async (rect1, rect2, {intersections}, scale = 10) => {
  const overlap = [];
  if (intersections.length) {
    overlap.push(
      `ctx.moveTo(${intersections[0].x * scale}, ${
        intersections[0].y * scale
      });`
    );
    intersections.slice(1).forEach((point) => {
      overlap.push(`ctx.lineTo(${point.x * scale}, ${point.y * scale});`);
    });
  }
  const contentArray = [
    "<!DOCTYPE html>",
    "<html>",
    "<body>",
    `<canvas id="myCanvas" width="${50 * scale}" height="${
      50 * scale
    }" style="border:1px solid black;">`,
    "Your browser does not support the HTML5 canvas tag.</canvas>",
    "<script>",
    'const canv = document.getElementById("myCanvas");',
    'const ctx = canv.getContext("2d");',
    "ctx.beginPath();",
    `ctx.lineWidth = "${scale / 2}";`,
    'ctx.strokeStyle = "magenta";',
    `ctx.rect(${rect1.x * scale}, ${rect1.y * scale}, ${rect1.width * scale}, ${
      rect1.height * scale
    });`,
    "ctx.stroke();",
    "ctx.beginPath();",
    `ctx.lineWidth = "${scale / 2}";`,
    'ctx.strokeStyle = "cyan";',
    `ctx.rect(${rect2.x * scale}, ${rect2.y * scale}, ${rect2.width * scale}, ${
      rect2.height * scale
    });`,
    "ctx.stroke();",
    "ctx.stroke();",
    "ctx.beginPath();",
    `ctx.lineWidth = "${scale / 2}";`,
    'ctx.strokeStyle = "blue";',
    ...overlap,
    "ctx.stroke();",
    "</script>",
    "</body>",
    "</html>",
  ];

  const content = contentArray.join("\n");
  await fs.writeFile(
    resolve(fileURLToPath(import.meta.url), "..", "..", "draw.html"),
    content,
    { flag: "w+" },
    (err) => {
      console.error(err);
    }
  );
};
