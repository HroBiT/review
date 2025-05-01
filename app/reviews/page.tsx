import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Heading from '@/components/Heading';
import { getReviews } from '@/lib/reviews';

export const metadata: Metadata = {
  title: 'Reviews',
};

export const revalidate = 30; 

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <>
      <Heading>Reviews</Heading>
      <ul className="flex flex-row flex-wrap gap-3">
        {reviews.map((review, index) => (
          <li key={review.slug}
            className="bg-white border rounded shadow w-80 hover:shadow-xl">
            <Link href={`/reviews/${review.slug}`}>
              <Image src={review.image} alt="" priority={index === 0}
                width="320" height="180" className="rounded-t"
              />
              <div>
              <h2 className="font-orbitron font-semibold py-1 text-center">
                {review.title}
              </h2>
              <p className="text-sm text-gray-500 text-center">
                {review.subtitle}
              </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}