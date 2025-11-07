import { getGqlClient, GQL } from "@/lib/gql";
import { notFound } from "next/navigation";
import PostDetailView from "@/components/post-detail-view";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const client = getGqlClient();
  try {
    const { postBySlug } = await client.request(GQL.PostBySlug, {
      slug: params.slug,
    });
    if (!postBySlug) return {};
    return {
      title: postBySlug.title,
      description: postBySlug.excerpt ?? "",
      openGraph: {
        title: postBySlug.title,
        description: postBySlug.excerpt ?? "",
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const client = getGqlClient();
  const { postBySlug } = await client.request<any>(GQL.PostBySlug, {
    slug: params.slug,
  });
  if (!postBySlug) notFound();

  return <PostDetailView post={postBySlug} />;
}
