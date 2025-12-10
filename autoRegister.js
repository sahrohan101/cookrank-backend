import fetch from "node-fetch";

const API = "http://localhost:5000";
const users = ["rohan", "amit", "sajan", "rajan", "saurav", "kuldeep"];

async function registerAll() {
  for (let u of users) {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: u, password: "1234" })
    });
    console.log(await res.json());
  }
}

registerAll();
