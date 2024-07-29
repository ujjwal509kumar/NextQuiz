import { connectToDatabase } from '../../../lib/mongodb';

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db('nextquiz');
    const collection = db.collection('scores');

    const scores = await collection.find({}).toArray();

    return new Response(JSON.stringify(scores), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error reading data:', error);
    return new Response(JSON.stringify({ error: 'Failed to read data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
