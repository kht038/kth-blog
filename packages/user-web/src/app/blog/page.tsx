import { getGqlClient, GQL } from "@/lib/gql";
import BlogListView from "@/components/blog-list-view";

const PAGE_SIZE = 10;

type SearchParams = { q?: string; tag?: string; page?: string };

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams | undefined;
}) {
  const sp =
    searchParams && typeof (searchParams as any).then === "function"
      ? await (searchParams as Promise<SearchParams>)
      : (searchParams as SearchParams | undefined) ?? {};

  const q = sp.q?.trim() || undefined;
  const tagSlug = sp.tag?.trim() || undefined;
  const page = Math.max(1, Number(sp.page ?? "1"));
  const skip = (page - 1) * PAGE_SIZE;

  const client = getGqlClient();
  const { tags } = await client.request<{ tags: any[] }>(GQL.Tags);

  const filter: any = {
    status: "published",
    q,
    skip,
    limit: PAGE_SIZE,
    sort: "publishedAt:desc",
  };

  if (tagSlug) {
    const t = tags.find((x) => x.slug === tagSlug);
    if (t) filter.tagIdsAny = [t.id];
  }

  const { posts } = await client.request<{
    posts: { total: number; items: any[] };
  }>(GQL.Posts, { filter });

  const totalPages = Math.max(1, Math.ceil(posts.total / PAGE_SIZE));

  return (
    <BlogListView
      q={q}
      tagSlug={tagSlug}
      page={page}
      totalPages={totalPages}
      tags={tags}
      items={posts.items}
    />
  );
}
