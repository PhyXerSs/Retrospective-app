// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import express from 'express';
const imageToBase64 = require('image-to-base64');
const handler = express();
handler.use(express.json());

export default (req:any, res:any) => {
  if (req.method === 'POST') {
    res.status(200).json({ data: req.body.url });
  }
}