export type SessionDescription = {
  id: string;
  isHost: boolean;
  partner: {
    id: string;
    name: string;
  };
};
