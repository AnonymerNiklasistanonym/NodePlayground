import { describe, expect, it, beforeAll, beforeEach, afterAll } from "vitest";
import { type Response } from "supertest";
import request from "supertest";
import app from "../src/app.js";

describe("GET /", () => {
  let count = 0;

  beforeAll(() => {
    console.log('beforeAll:', count)
  })

  beforeEach(() => {
    // Runs before all 'it' (even when nested!) in this describe (and all nested describes!)
    count += 1;
    console.log('beforeEach:', count)
  })

  it("Root", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World!");
  });

  describe("Home", () => {
    let response: Response;
    beforeEach(async () => {
        response = await request(app).get("/Home");
    })
    it("Status", () => {
        expect(response.status).toBe(200);
    });
    it("Text", () => {
        expect(response.text).toBe("Hello World! [HOME]");
    });
  });

  afterAll(() => {
    console.log('afterAll:', count)
  })
});

describe("NOT FOUND", () => {
  it("Non existing route", async () => {
    const response = await request(app).get("/dsadsadada");

    expect(response.status, "Expected correct HTTP status code for /dsadsadada").toBe(404);
    expect(response.text).toBe("Not Found");
  });
});
