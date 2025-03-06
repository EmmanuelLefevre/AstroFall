import { Db, MongoClient, MongoClientOptions } from "mongodb";


if (!process.env.MONGODB_URI || !process.env.MONGODB_DB) {
  throw new Error(
    'Invalid/Missing environment variable: "process.env.MONGODB_URI" or "process.env.MONGODB_DB"'
  );
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 50
};

let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    let client: MongoClient;

    if (process.env.NODE_ENV === "development") {
      const globalWithMongo = globalThis as typeof globalThis & { _mongoClient?: MongoClient };

      if (!globalWithMongo._mongoClient) {
        globalWithMongo._mongoClient = new MongoClient(MONGODB_URI, options);
      }

      client = await globalWithMongo._mongoClient.connect();
    }
    else {
      client = await new MongoClient(MONGODB_URI, options).connect();
    }

    const db = client.db(MONGODB_DB);
    cachedDb = db;

    return db;
  }

  catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Erreur de connexion à MongoDB: ", error.message);
      throw new Error("Impossible de se connecter à MongoDB !");
    }
    console.error("❌ Erreur inconnue lors de la connexion à MongoDB: ", error);
    throw new Error("Une erreur inconnue est survenue !");
  }
}
