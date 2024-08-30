"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reqHeaders = new Headers({
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
});

const errorSchema = z.array(
  z.object({ field: z.string(), message: z.string() })
);

export async function createUser(prevState: any, formData: FormData) {
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    gender: formData.get("gender"),
    status: formData.get("status"),
  };

  const res = await fetch(`${process.env.BASE_URL}/users`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: reqHeaders,
  });
  const json = await res.json();
  if (res.status === 422) {
    return {
      errors: errorSchema.parse(json).reduce((total, { field, message }) => {
        total[field] = message;
        return total;
      }, {} as Record<string, string>),
    };
  }

  revalidatePath("/users");
  return redirect("/users");
}
