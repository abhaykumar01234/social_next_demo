"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const reqHeaders = new Headers({
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
});

export async function createPost(prevState: any, formData: FormData) {
  const userId = String(formData.get("userId"));
  const payload = {
    title: formData.get("title"),
    body: formData.get("body"),
  };

  await fetch(`${process.env.BASE_URL}/users/${userId}/posts`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: reqHeaders,
  });

  revalidatePath(`/users/${userId}/posts`);
  revalidatePath(`/`);
  return redirect(`/users/${userId}/posts`);
}
