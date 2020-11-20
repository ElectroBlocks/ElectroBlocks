import sirv from "sirv";
import compression from "compression";
import * as sapper from "@sapper/server";
import express from "express";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

express() 
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT, () => {
    console.log("working");
  });