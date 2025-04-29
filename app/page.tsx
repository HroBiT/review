import Link from 'next/link';
import Heading from '@/components/Heading';
import { getReviews } from '@/lib/reviews';
import Image from 'next/image';

export default async function HomePage() {
  const reviews = await getReviews(6);
  console.log('[HomePage] rendering', reviews);

  return (
    <>
      <Heading>Indie Gamer</Heading>
      <p className="pb-3 text-gray-700">
        Only the best indie games, reviewed for you.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review,index) => (
          <div
            key={review.slug}
            className="bg-white items-center justify-center flex border rounded shadow hover:shadow-xl transition-shadow duration-300"
          >
            <Link href={`/reviews/${review.slug}`}  className="flex flex-col">
              <Image
                src={review.image}
                alt={`Cover image for ${review.title}`}
                width="320"
                height="180"
                className="rounded-t"
                priority={index === 0}
              />
              <h2 className="font-orbitron font-semibold py-2 text-center text-gray-800">
                {review.title}
              </h2>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}