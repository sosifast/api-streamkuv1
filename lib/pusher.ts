import Pusher from "pusher";

export const pusherServer = new Pusher({
  appId: "2058947",
  key: "6e69b3265e9c4a7a147f",
  secret: "d533924acdec92ca1b1e",
  cluster: "ap1",
  useTLS: true,
});
