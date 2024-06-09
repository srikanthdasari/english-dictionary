/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express, { Request, Response } from 'express';
import * as path from 'path';
import { createClient } from 'redis';
import axios from 'axios';

const app = express();

// Redis configuration
const redisClient = createClient({
  url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to bridge!' });
});

app.get('/api/dict', async (req: Request, res: Response) => {
  try {
    const documentId = req.query.id as string;

    if (!documentId) {
      return res.status(400).send('Document ID is required');
    }

    // Check if the document exists in Redis
    const existingDocument = await redisClient.get(documentId);

    if (existingDocument) {
      return res.status(200).json(JSON.parse(existingDocument));
    } else {
      // If not found in Redis, fetch from external API
      const externalEndpoint = `https://external-api.com/data?id=${documentId}`;
      const externalResponse = await axios.get(externalEndpoint);
      const data = externalResponse.data;

      // Store the fetched data in Redis with a TTL of 1 hour (3600 seconds)
      await redisClient.setEx(documentId, 3600, JSON.stringify(data));

      return res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
