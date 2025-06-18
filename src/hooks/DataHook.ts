export type DataHook<T, X> = X &
  (
    | {
        loading: true;
        data?: undefined;
        error?: undefined;
      }
    | {
        loading: false;
        data?: undefined;
        error: string;
      }
    | {
        loading: false;
        data: T;
        error?: undefined;
      }
  );
