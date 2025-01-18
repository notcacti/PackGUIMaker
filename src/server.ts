import express from "express";
import path from "path";
import make from "./ui-maker.js";
import { AddressInfo } from "net";

const app = express();

const staticRootPath = path.join(process.resourcesPath, "wwwroot");

app.use(express.json({ limit: "100mb" }));

app.post("/api/genUi", async (req, res) => {
  const { packName, packBufferString, xpPercentString, upscaleRateString } =
    req.body;

  const xpPercent = parseFloat(xpPercentString);
  const upscaleRate = parseInt(upscaleRateString);
  const packBuffer = Buffer.from(packBufferString, "base64");

  if (Number.isNaN(xpPercent) || Number.isNaN(upscaleRate))
    res.status(400).send({
      message: "Invalid Body Parameters! (xpupscale)",
    });

  if (!packName || !packBuffer || !xpPercent || !upscaleRate)
    return res
      .status(400)
      .send({ message: "Invalid Body Parameters! (no spec param)" });

  if (!packName.endsWith(".zip") && !packName.endsWith(".mcpack"))
    return res
      .status(400)
      .send({ message: "Invalid Body Parameters! (wrong pack)" });

  if (upscaleRate <= 0 && upscaleRate >= 11)
    return res
      .status(400)
      .send({ message: "Invalid Body Parameters!(invalid upscale)" });

  if (xpPercent <= 0 && xpPercent >= 1)
    return res
      .status(400)
      .send({ message: "Invalid Body Parameters!(invalid xp)" });

  try {
    const imgBuffer = await make(packName, packBuffer, upscaleRate, xpPercent);

    res.setHeader("Content-Type", "image/png");
    res.status(201).send(imgBuffer);
  } catch (err) {
    console.error("Error while making UI:", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(staticRootPath, "index.html"));
});

export function startServer(): Promise<number> {
  app.use(express.static(staticRootPath));

  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const port = (server.address() as AddressInfo).port;
      console.log(`Daemon started at port: ${port}`);
      resolve(port);
    });

    server.on("error", (err) => {
      reject(err);
    });
  });
}
