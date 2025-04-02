import client from "@/lib/db";
import { sendEmailDocListNotification } from "./sendDocListEmail";

const listenForMydocListUpdates = () => {
  const extractRecipients = (shareData: any) => {
    const emails: string[] = [];
    const chats: number[] = [];
    const sms: string[] = [];

    if (!shareData || !shareData.toUsers) return { emails, chats, sms };

    // Process individual users
    if (Array.isArray(shareData.toUsers)) {
      shareData.toUsers.forEach((user: any) => {
        if (user.share_on_channel && user.share_on_channel.includes("email")) {
          emails.push(user.email);
        }
        if (user.share_on_channel && user.share_on_channel.includes("chat")) {
          chats.push(user.user_id);
        }
        if (
          user.share_on_channel &&
          user.share_on_channel.includes("mobile") &&
          user.values &&
          user.values.mobile
        ) {
          sms.push(user.values.mobile);
        }
      });
    }

    // Process groups
    if (shareData.toGroups && Array.isArray(shareData.toGroups)) {
      shareData.toGroups.forEach((group: any) => {
        if (group.members && Array.isArray(group.members)) {
          group.members.forEach((member: any) => {
            if (
              member.share_on_channel &&
              member.share_on_channel.includes("email")
            ) {
              emails.push(member.email);
            }
            if (
              member.share_on_channel &&
              member.share_on_channel.includes("chat")
            ) {
              chats.push(member.user_id);
            }
            if (
              member.share_on_channel &&
              member.share_on_channel.includes("mobile") &&
              member.values &&
              member.values.mobile
            ) {
              sms.push(member.values.mobile);
            }
          });
        }
      });
    }

    return { emails, chats, sms };
  };

  // Make sure we're not registering multiple listeners
  client.removeAllListeners("notification");

  // Listen for database notifications
  client.query("LISTEN mydoc_list_update");

  client.on("notification", async (msg: any) => {
    try {
      console.log("Raw notification payload:", msg.payload);
      const data = JSON.parse(msg.payload);
      console.log("Parsed notification data:", data);

      // Extract recipients from the share_to_user_json field
      const recipients = extractRecipients(data.share_to_user_json);
      console.log("Extracted recipients:", recipients);

      // Send email notifications
      if (recipients.emails.length > 0) {
        await sendEmailDocListNotification(recipients.emails, data);
      }

      // Handle chat notifications
      if (recipients.chats.length > 0) {
        console.log("Trigger chat notification for users:", recipients.chats);
        // Implement chat notification logic
      }

      // Handle SMS notifications
      if (recipients.sms.length > 0) {
        console.log("Send SMS to users:", recipients.sms);
        // Implement SMS notification logic
      }
    } catch (error) {
      console.error("Error processing notification:", error);
    }
  });
};

export default listenForMydocListUpdates;
