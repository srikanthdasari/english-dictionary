/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express, { Request, Response } from 'express';
import * as path from 'path';
import { createClient } from 'redis';
import _ from 'lodash';
import axios from 'axios';
import { DictionaryEntry } from './models/index';

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
  res.send({ message: 'Welcome to bridge API!' });
});

app.get('/api/dict/:input', async (req: Request, res: Response) => {
  try {
    console.log('req.query', req.params);
    const documentId = req.params.input as string;

    if (!documentId || _.isNumber(documentId)) {
      return res.status(400).send('Document ID is required');
    }

    // Check if the document exists in Redis
    const existingDocument = await redisClient.get(documentId);
    if (existingDocument && !_.isEmpty(existingDocument) && !_.isEmpty(JSON.parse(existingDocument))) {
      console.log('** Serving from redis');
      return res.status(200).json(JSON.parse(existingDocument));
    } else {
      console.log('** Serving from external endpoint');
      // If not found in Redis, fetch from external API
      const externalEndpoint = `https://api.dictionaryapi.dev/api/v2/entries/en/${documentId}`;
      const externalResponse = await axios.get(externalEndpoint);
      console.log('externalResponse', externalResponse);
      const data = new DictionaryEntry(externalResponse.data);

      // Store the fetched data in Redis with a TTL of 1 hour (3600 seconds)
      await redisClient.setEx(documentId, 3600, JSON.stringify(data.getJson()));

      return res.status(200).json(data.getJson());
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
