import client from "@/lib/db";
import { sendEmailNotification } from "./sendEmail";

const listenForNotifications = () => {
  client.query("LISTEN form_setup_update");

  client.on("notification", async (msg: any) => {
    const data = JSON.parse(msg.payload);

    const recipients = data.users_json;

    console.log("data----", data);
    console.log("recipients----", recipients);

    if (recipients && recipients.length > 0) {
      await sendEmailNotification(recipients, data);
    }
  });
};

// listenForNotifications();

export default listenForNotifications;
