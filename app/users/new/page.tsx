"use client";

import {
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  HStack,
  Radio,
  Button,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useFormState } from "react-dom";
import { createUser } from "./actions/createUser";

export default function NewUser() {
  const [state, formAction, pending] = useFormState(createUser, {
    errors: {},
  });

  return (
    <VStack alignItems="flex-start" spacing="24px" width="100%">
      <Heading>Create New User</Heading>
      <Link href="/users">Back to Users</Link>
      <VStack
        as="form"
        spacing="24px"
        alignItems="flex-start"
        action={formAction}
        width="100%"
      >
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input type="text" name="name" required />
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" required />
          <Text fontSize="xs" color="red">
            {state.errors?.email && "Email " + state.errors?.email}
          </Text>
        </FormControl>

        <FormControl>
          <FormLabel>Gender</FormLabel>
          <RadioGroup name="gender" defaultValue="male">
            <HStack spacing="24px">
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Status</FormLabel>
          <RadioGroup name="status" defaultValue="inactive">
            <HStack spacing="24px">
              <Radio value="inactive">Inactive</Radio>
              <Radio value="active">Active</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          disabled={pending}
          isLoading={pending}
        >
          {pending ? "Adding" : "Add"} User
        </Button>
      </VStack>
    </VStack>
  );
}
