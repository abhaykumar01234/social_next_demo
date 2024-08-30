import { Divider, Heading, VStack, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
import { Fragment } from "react";
import { z } from "zod";

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

export default async function UserPosts({
  params,
}: {
  params: { userId: string };
}) {
  const res = await fetch(
    `${process.env.BASE_URL}/users/${params.userId}/posts`,
    { headers: reqHeaders }
  );
  const allPosts = z.array(postsSchema).parse(await res.json());

  return (
    <VStack spacing="24px" alignItems="flex-start">
      <Heading>User {params.userId} - Posts</Heading>
      <Link href="/users">Back to Users</Link>

      <Button
        leftIcon={<>+</>}
        colorScheme="blue"
        as={Link}
        href={`/users/${params.userId}/posts/new`}
      >
        Add New Post
      </Button>

      {allPosts.length === 0 ? (
        <Text>No Posts</Text>
      ) : (
        allPosts.map((post) => (
          <Fragment key={post.id}>
            <VStack spacing="24px" alignItems="flex-start">
              <Heading size="sm">{post.title}</Heading>
              <p>{post.body}</p>
            </VStack>
            <Divider />
          </Fragment>
        ))
      )}
    </VStack>
  );
}
