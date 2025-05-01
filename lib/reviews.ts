import { marked } from 'marked';
import qs from 'qs';

const CMS_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';

interface CmsItem {
  id: number;
  attributes: any;
}

export interface Review {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  image: string;
}

export interface FullReview extends Review {
  body: string;
}


export async function getFeaturedReview(): Promise<Review | null> {
  const reviews = await getReviews(1);
  return reviews[0] ?? null;
}

export async function getReviews(pageSize: number = 6): Promise<Review[]> {
  const { data } = await fetchReviews({
    fields: ['slug', 'title', 'subtitle', 'publishedAt'],
    populate: { image: { fields: ['url'] } },
    sort: ['publishedAt:desc'],
    pagination: { pageSize },
  });
  return Array.isArray(data) ? data.map(toReview).filter(Boolean) : [];
}


export async function getReview(slug: string): Promise<FullReview | null> {
  const { data } = await fetchReviews({
    filters: { slug: { $eq: slug } },
    fields: ['slug', 'title', 'subtitle', 'publishedAt', 'body'],
    populate: { image: { fields: ['url'] } },
    pagination: { pageSize: 1, withCount: false },
  });
  if (!data || data.length === 0) return null;
  const item = data[0];
  return {
    ...toReview(item),
    body: marked(item.attributes.body ?? ''),
  };
}

// Pobiera listę slugów recenzji
export async function getSlugs(): Promise<string[]> {
  const { data } = await fetchReviews({
    fields: ['slug'],
    sort: ['publishedAt:desc'],
    pagination: { pageSize: 100 },
  });
  return Array.isArray(data)
    ? data.map((item: CmsItem) => item.attributes?.slug).filter(Boolean)
    : [];
}

async function fetchReviews(parameters: any) {
  const url =
    `${CMS_URL}/api/reviews?` +
    qs.stringify(parameters, { encodeValuesOnly: true });

  const response = await fetch(url, {
    next: { tags: ['reviews'], revalidate: 60 },
    headers: {
      'Content-Type': 'application/json',

    },
  });

  if (!response.ok) {
    throw new Error(`CMS returned ${response.status} for ${url}`);
  }
  return await response.json();
}


function toReview(item: CmsItem): Review {
  const { attributes } = item;
  if (!attributes) {
    return null as any;
  }
  const imageUrl =
    attributes.image?.data?.attributes?.url
      ? getStrapiMedia(attributes.image.data.attributes.url)
      : '/default-image.jpg';

  return {
    slug: attributes.slug ?? '',
    title: attributes.title ?? '',
    subtitle: attributes.subtitle ?? '',
    date: (attributes.publishedAt ?? '').slice(0, 10),
    image: imageUrl,
  };
}

function getStrapiMedia(url: string | null): string {
  if (!url) return '/default-image.jpg';
  if (url.startsWith('data:')) return url;
  if (url.startsWith('http') || url.startsWith('//')) return url;
  return `${CMS_URL}${url}`;
}
