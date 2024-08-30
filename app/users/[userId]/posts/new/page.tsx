"use client";

import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useFormState } from "react-dom";
import { createPost } from "./actions/createPost";

export default async function NewPost({
  params,
}: {
  params: { userId: string };
}) {
  const [, formAction, pending] = useFormState(createPost, {
    userId: params.userId,
  });

  return (
    <VStack alignItems="flex-start" spacing="24px" width="100%">
      <Heading>Create New Post</Heading>
      <Link href={`/users/${params.userId}/posts`}>Back to Posts</Link>
      <VStack
        as="form"
        alignItems="flex-start"
        spacing="24px"
        width="100%"
        action={formAction}
      >
        <input type="hidden" name="userId" value={params.userId} />
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input type="text" name="title" required />
        </FormControl>
        <FormControl>
          <FormLabel>Body</FormLabel>
          <Textarea
            placeholder="Enter your post here..."
            name="body"
            required
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          disabled={pending}
          isLoading={pending}
        >
          {pending ? "Creating" : "Create"} Post
        </Button>
      </VStack>
    </VStack>
  );
}
