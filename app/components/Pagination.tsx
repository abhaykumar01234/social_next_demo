"use client";

import { Button, HStack, Select, Text } from "@chakra-ui/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

type PaginationProps = {
  meta: {
    limit: string | number;
    page: string | number;
    pages: string | number;
    total: string | number;
  };
};

export const Pagination = ({ meta }: PaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handlePageChange = (page: string) => {
    if (Number(page) < 1 || Number(page) > Number(meta.pages)) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    replace(`${pathname}?${params.toString()}`);
  };

  const handlePageSizeChange = (pageCount: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("per_page", pageCount);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <HStack spacing="16px" align="center" width="100%">
      <Text>Total Items : {meta.total}</Text>
      <Button onClick={() => handlePageChange(String(1))}>&lt;&lt;</Button>
      <Button onClick={() => handlePageChange(String(Number(meta.page) - 1))}>
        &lt;
      </Button>
      <Text>{meta.page}</Text>
      <Button onClick={() => handlePageChange(String(Number(meta.page) + 1))}>
        &gt;
      </Button>
      <Button onClick={() => handlePageChange(String(Number(meta.pages)))}>
        &gt;&gt;
      </Button>
      <Select
        size="sm"
        value={Number(searchParams.get("per_page") || meta.limit)}
        onChange={(e) => handlePageSizeChange(e.target.value)}
        width="auto"
      >
        {[10, 25, 50, 75, 100].map((pageCount) => (
          <option key={pageCount} value={pageCount}>
            Show {pageCount} items
          </option>
        ))}
      </Select>
      <Text>
        Showing items {(Number(meta.page) - 1) * Number(meta.limit) + 1} to{" "}
        {Math.min(Number(meta.page) * Number(meta.limit), Number(meta.total))}
      </Text>
    </HStack>
  );
};
