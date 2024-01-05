interface Page<T> {
  data: T[];
  meta: {
    limit: number;
    offset: number;
    total: number;
  };
}

export default Page;
