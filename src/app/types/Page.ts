interface Page<T> {
  data: T[];
  meta: {
    total: number;
  };
}

export default Page;
