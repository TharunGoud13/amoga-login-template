import { Client } from "pg";

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

export default client;
