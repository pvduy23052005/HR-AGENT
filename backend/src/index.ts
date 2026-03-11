import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.MODEL_NAME || 'qwen2.5:3b';

app.post('/ask', async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: MODEL,
            prompt: req.body.prompt,
            stream: false
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'AI Service Unreachable' });
    }
});

app.listen(3000, () => console.log('Backend running on port 3000'));