import { Hono } from "hono";

export const app = new Hono();

app.get("/hono", (c) => {
	return c.text("Hello World!");
});