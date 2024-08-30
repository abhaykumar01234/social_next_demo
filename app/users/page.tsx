import {
  Heading,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Tfoot,
} from "@chakra-ui/react";
import Link from "next/link";
import { z } from "zod";
import { Pagination } from "@/app/components/Pagination";
import { ReactNode } from "react";

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  gender: z.string(),
  status: z.enum(["active", "inactive"]),
});

type ColumnKey = keyof z.infer<typeof userSchema>;
const columns: Array<{
  key: ColumnKey;
  label: string;
  render?: (val: ReactNode) => ReactNode;
}> = [
  {
    key: "id",
    label: "ID",
    render: (id) => <Link href={`/users/${id}/posts`}>{id}</Link>,
  },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "gender", label: "Gender" },
  { key: "status", label: "Status" },
];

const reqHeaders = new Headers({
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
});

export default async function Users({
  searchParams,
}: {
  searchParams?: { page?: string; per_page?: string };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const noOfRowsPerPage = Number(searchParams?.per_page) || 10;
  const res = await fetch(
    `${process.env.BASE_URL}/users?page=${currentPage}&per_page=${noOfRowsPerPage}`,
    { headers: reqHeaders }
  );
  const data = await res.json();
  const headers = res.headers;

  const users = z.array(userSchema).parse(data);

  const meta = {
    limit: headers.get("x-pagination-limit") || 10,
    page: headers.get("x-pagination-page") || 1,
    pages: headers.get("x-pagination-pages") || 1,
    total: headers.get("x-pagination-total") || 0,
  };

  return (
    <VStack alignItems="flex-start" spacing="24px">
      <Heading>Users</Heading>
      <Button leftIcon={<>+</>} colorScheme="blue" as={Link} href="/users/new">
        Add New User
      </Button>
      {users.length > 0 && (
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                {columns.map((col) => (
                  <Th key={col.key}>{col.label}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  {columns.map((col) => (
                    <Td key={col.key}>
                      {col.render ? col.render(user[col.key]) : user[col.key]}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Td colSpan={columns.length}>
                  <Pagination meta={meta} />
                </Td>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      )}
    </VStack>
  );
}
