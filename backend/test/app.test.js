import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";

import app from "../src/app.js";

test("GET /api/v1/health returns API health status", async () => {
  const response = await request(app)
    .get("/api/v1/health")
    .expect(200);

  assert.equal(response.body.success, true);
  assert.equal(
    response.body.message,
    "LinkScale API is running"
  );
});

test("health endpoint includes security headers", async () => {
  const response = await request(app)
    .get("/api/v1/health")
    .expect(200);

  assert.equal(
    response.headers["x-content-type-options"],
    "nosniff"
  );

  assert.equal(
    response.headers["x-frame-options"],
    "SAMEORIGIN"
  );
});

test("CORS allows the configured frontend origin", async () => {
  const response = await request(app)
    .options("/api/v1/health")
    .set("Origin", "http://localhost:5173")
    .set("Access-Control-Request-Method", "GET")
    .expect(204);

  assert.equal(
    response.headers["access-control-allow-origin"],
    "http://localhost:5173"
  );

  assert.equal(
    response.headers["access-control-allow-credentials"],
    "true"
  );
});

test("protected URL route rejects unauthenticated requests", async () => {
  const response = await request(app)
    .get("/api/v1/urls")
    .expect(401);

  assert.equal(response.body.success, false);
  assert.equal(
    response.body.message,
    "Please log in to access this resource"
  );

  assert.ok(response.headers.ratelimit);
});

test("registration route validates required fields", async () => {
  const response = await request(app)
    .post("/api/v1/auth/register")
    .send({
      email: "invalid@example.com",
    })
    .expect(400);

  assert.equal(response.body.success, false);

  assert.equal(
    response.body.message,
    "Name, email, password and password confirmation are required"
  );
});

test("unknown API route returns 404", async () => {
  const response = await request(app)
    .get("/api/v1/unknown-route")
    .expect(404);

  assert.equal(response.body.success, false);
  assert.equal(
    typeof response.body.message,
    "string"
  );
});