import Pusher from "pusher";

const pusherServer = new Pusher({
  appId: "2058947",
  key: "6e69b3265e9c4a7a147f",
  secret: "d533924acdec92ca1b1e",
  cluster: "ap1",
  useTLS: true,
});

pusherServer.trigger("admin-notifications", "new-user", {
  message: "Test message from server script",
  time: new Date().toISOString()
}).then(() => {
  console.log("Trigger success");
}).catch((e) => {
  console.error("Trigger error", e);
});
