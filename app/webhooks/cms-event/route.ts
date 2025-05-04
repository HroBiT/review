import { revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';
import { CACHE_TAG_REVIEWS } from '@/lib/reviews';

const API_URL = 'http://localhost:1337';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    if (payload.model === 'review') {
      const response = await fetch(`${API_URL}/api/reviews/${payload.entry.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch review from API:', response.status);
        return new Response('Failed to fetch review from API', { status: 500 });
      }

      const reviewData = await response.json();
      console.log('Fetched review data:', reviewData);

      revalidateTag(CACHE_TAG_REVIEWS);
      console.log('Revalidated cache for:', CACHE_TAG_REVIEWS);
    } else {
      console.warn('Unsupported model:', payload.model);
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Invalid request', { status: 400 });
  }
}
