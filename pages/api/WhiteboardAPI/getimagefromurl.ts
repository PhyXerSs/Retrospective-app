import type { NextApiRequest, NextApiResponse } from 'next'
import express from 'express';
const imageToBase64 = require('image-to-base64');
const handler = express();
handler.use(express.json());

export default async (req:any, res:any) => {
  if (req.method === 'POST') {
    const base64 = await imageToBase64(req.body.url) as String // Image URL
    res.status(200).json({ imageurl: 'data:image/jpeg;base64,'+ base64 });
  }
}