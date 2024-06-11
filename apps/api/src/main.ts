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
import { promisify } from 'util';

const app = express();

// Redis configuration
const redisClient = createClient({
  url: 'redis://localhost:6379'
});

interface KeyValues {
  [key: string]: any;
}

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
      // const data = new DictionaryEntry(externalResponse.data[0]);
      const data = externalResponse.data;
      // Store the fetched data in Redis with a TTL of 1 hour (3600 seconds)
      try {
        await redisClient.setEx(documentId, 3600, JSON.stringify(data));
        return res.status(200).json(data);
      } catch (error) {
        console.error('Error setting Redis key or sending response:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

app.get('/api/keys/:stroke', async (req: Request, res: Response) => {
  try {
    const keys: string[] = await new Promise((resolve, reject) => {
      redisClient.keys(`${req.params.stroke}*`, (err, keys) => {
        if (err) {
          return reject(err);
        }
        resolve(keys);
      });
    });

    if (keys.length === 0) {
      return res.status(200).json({ message: 'No keys found' });
    }

    const keyValues: KeyValues = {};

    await Promise.all(keys.map(key => {
      return new Promise<void>((resolve, reject) => {
        redisClient.get(key, (err: Error, value: string) => {
          if (err) {
            console.error(`Error fetching value for key ${key} from Redis:`, err);
            keyValues[key] = null;
            return resolve();
          }

          try {
            keyValues[key] = value ? JSON.parse(value) : null;
          } catch (parseError) {
            keyValues[key] = value;
          }
          resolve();
        });
      });
    }));

    return res.status(200).json(keyValues);
  } catch (error) {
    console.error('Error fetching keys from Redis:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
