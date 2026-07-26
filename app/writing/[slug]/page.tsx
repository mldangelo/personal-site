import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import PostContent from '@/components/Writing/PostContent';
import { sharedOpenGraph, sharedTwitter } from '@/lib/metadata';
import { getPostBySlug, getPostSlugs } from '@/lib/posts';
import {
  blogPostingNode,
  breadcrumbNode,
  HOME_URL,
  webPageNode,
} from '@/lib/schema';
import {
  AUTHOR_NAME,
  formatDate,
  SHARE_IMAGE_DIMENSIONS,
  SHARE_IMAGE_PATH,
  SITE_URL,
} from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const url = `${SITE_URL}/writing/${post.slug}/`;

  // Spreading the shared blocks matters: a route-level `openGraph` replaces
  // the inherited one, so anything omitted here — images, siteName, locale,
  // twitter:site — simply disappears from post pages.
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      ...sharedOpenGraph,
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      authors: [AUTHOR_NAME],
    },
    twitter: {
      ...sharedTwitter,
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const postUrl = `${SITE_URL}/writing/${post.slug}/`;
  const writingUrl = `${SITE_URL}/writing/`;

  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[
          webPageNode({
            url: postUrl,
            name: post.title,
            description: post.description,
            hasBreadcrumb: true,
          }),
          blogPostingNode(post),
          breadcrumbNode(postUrl, [
            { name: 'Home', url: HOME_URL },
            { name: 'Writing', url: writingUrl },
            { name: post.title, url: postUrl },
          ]),
        ]}
      />
      <article className="post-page">
        <header className="post-header">
          <time className="post-date" dateTime={post.date}>
            {formatDate(post.date)}
          </time>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-description">{post.description}</p>
        </header>
        <div className="post-content prose">
          <PostContent content={post.content} />
        </div>
      </article>
    </PageWrapper>
  );
}
