import { connectToDatabase } from '../../../lib/mongodb';

export async function POST(req) {
  try {
    const { name, score, category } = await req.json();
    const client = await connectToDatabase();
    const db = client.db('nextquiz');
    const collection = db.collection('scores');

    const result = await collection.insertOne({
      name,
      score,
      category,
      time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }),
    });

    return new Response(JSON.stringify({ message: 'Score saved successfully', result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving score:', error);
    return new Response(JSON.stringify({ error: 'Failed to save score' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
