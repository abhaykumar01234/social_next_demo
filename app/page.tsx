import { Divider, Heading, VStack } from "@chakra-ui/react";
import { Fragment } from "react";
import { z } from "zod";
import { Pagination } from "@/app/components/Pagination";

const postsSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string(),
  body: z.string(),
});

const reqHeaders = new Headers({
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
});

export default async function Posts({
  searchParams,
}: {
  searchParams?: { page?: string; per_page?: string };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const noOfRowsPerPage = Number(searchParams?.per_page) || 10;
  const res = await fetch(
    `${process.env.BASE_URL}/posts?page=${currentPage}&per_page=${noOfRowsPerPage}`,
    { headers: reqHeaders }
  );
  const allPosts = z.array(postsSchema).parse(await res.json());
  const headers = res.headers;
  const meta = {
    limit: headers.get("x-pagination-limit") || 10,
    page: headers.get("x-pagination-page") || 1,
    pages: headers.get("x-pagination-pages") || 1,
    total: headers.get("x-pagination-total") || 0,
  };

  return (
    <VStack spacing="24px" alignItems="flex-start">
      <Heading>My Feed</Heading>

      {allPosts.map((post) => (
        <Fragment key={post.id}>
          <VStack spacing="24px" alignItems="flex-start">
            <Heading size="sm">
              {post.title} - <small>By {post.user_id}</small>
            </Heading>
            <p>{post.body}</p>
          </VStack>
          <Divider />
        </Fragment>
      ))}
      <Pagination meta={meta} />
      <br />
      <br />
    </VStack>
  );
}
