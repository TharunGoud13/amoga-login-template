import { NextRequest, NextResponse } from "next/server";
import Imap from "imap";
import { simpleParser } from "mailparser";
import { auth } from "@/auth";
import axiosInstance from "@/utils/axiosInstance";
import { EMAIL_LIST_API } from "@/constants/envConfig";

// Define an interface for email structure to improve type safety
interface EmailData {
  subject: string;
  body: string;
  from_user_email: string;
  to_user_email: string[] | any;
  created_date: string;
  is_read: boolean;
  template: boolean;
  cc_emails: string[] | any;
  bcc_emails: string[] | any;
  sender_name: string;
  business_number: string;
  created_user_name: string;
  created_user_id: string;
  email_uid?: string; // Changed from number to string per schema
  // Additional fields from schema
  status?: string;
  email_message?: string;
  is_starred?: boolean;
  is_important?: boolean;
  is_draft?: boolean;
  is_deleted?: boolean;
  sender_email?: string;
  from_user_name?: string;
}

export async function POST(req: NextRequest) {
  try {
    // Extract IMAP settings from the request body
    const { imapSettings } = await req.json();
    console.log("imapSettings---->", imapSettings);

    // Validate that IMAP settings were provided
    if (!imapSettings) {
      return NextResponse.json(
        { error: "IMAP configuration not provided" },
        { status: 400 }
      );
    }

    // Get the authenticated user's session
    const session: any = await auth();

    // Fetch emails using IMAP - returns a promise that resolves with an array of emails
    const emails: EmailData[] = await new Promise((resolve, reject) => {
      // Create a new IMAP connection with the provided settings
      const imap = new Imap({
        user: imapSettings.user,
        password: imapSettings.password,
        host: imapSettings.host,
        port: imapSettings.port,
        tls: imapSettings.tls,
        tlsOptions: { rejectUnauthorized: false }, // Allow self-signed certificates
      });

      // Initialize an empty array to store fetched emails
      const emails: EmailData[] = [];

      // Event handler for when the IMAP connection is ready
      imap.once("ready", () => {
        // Open the INBOX mailbox in read-only mode (false parameter)
        imap.openBox("INBOX", false, (err) => {
          if (err) reject(err);

          // Define what parts of the email to fetch
          const fetchOptions = {
            bodies: ["HEADER", "TEXT", ""], // Fetch headers, text body, and full message
            markSeen: false, // Don't mark emails as read when fetching
          };

          // Search for all emails in the inbox
          imap.search(["UNSEEN"], (err, results) => {
            if (err) reject(err);

            // If no emails found, resolve with empty array and end connection
            if (results.length === 0) {
              imap.end();
              resolve([]);
              return;
            }
            console.log("results---->", results);

            // Track how many emails have been processed
            let processedCount = 0;
            // Fetch the emails based on search results
            const fetcher = imap.fetch(results, fetchOptions);
            console.log("fetcher---->", fetcher);
            // Event handler for each message received
            fetcher.on("message", (msg) => {
              // Initialize email object with default values and user info from session
              let email: EmailData = {
                // Generate unique ID for the email
                subject: "",
                body: "",
                from_user_email: "",
                to_user_email: [session?.user?.email],
                created_date: "",
                is_read: false,
                template: false,
                cc_emails: [],
                bcc_emails: [],
                sender_name: "",
                business_number: session?.user?.business_number,
                created_user_name: session?.user?.name,
                created_user_id: session?.user?.id,
                status: "active",
                email_message: "",
                is_starred: false,
                is_important: false,
                is_draft: false,
                is_deleted: false,
                sender_email: "",
                from_user_name: "",
              };

              // Event handler for email attributes (flags, etc.)
              msg.once("attributes", (attrs) => {
                // Check if the email has been read by examining the 'Seen' flag
                email.is_read =
                  Array.isArray(attrs.flags) && attrs.flags.includes("\\Seen");
                email.email_uid = attrs.uid?.toString(); // Store the unique ID from the mail server
              });

              // Event handler for email body parts
              msg.on("body", (stream, info) => {
                // Handle TEXT part of the email
                if (info.which === "TEXT") {
                  stream.on("data", (chunk) => {
                    // Try to extract HTML content from the text part
                    const formattedText = chunk
                      .toString("utf8")
                      .match(/<div[^>]*>(.*?)<\/div>/);
                    email.body += formattedText || ""; // Append to body, handle null case
                  });
                }

                // Handle HEADER part of the email
                if (info.which === "HEADER") {
                  // Initialize header property if it d

                  stream.on("data", (chunk) => {
                    // Store raw header data
                    // email.header += chunk.toString("utf8");?
                  });
                }

                // Handle the full message (empty string in bodies array)
                if (info.which === "") {
                  let buffer = "";
                  // Collect all chunks of the message
                  stream.on("data", (chunk) => {
                    buffer += chunk.toString("utf8");
                  });

                  // Process the complete message when stream ends
                  stream.once("end", () => {
                    // Parse the email using mailparser
                    simpleParser(buffer, (err, parsed: any) => {
                      if (err) {
                        return; // Skip this email if parsing fails
                      }

                      // Extract sender's email from the "From" field
                      const fromEmail = parsed.from?.text?.split("<")[1];

                      // Try to extract HTML content from the text
                      const formattedText = parsed.text?.match(
                        /<div[^>]*>(.*?)<\/div>/
                      );

                      // Populate email object with parsed data
                      // When parsing email data
                      email.subject = parsed.subject || "No Subject";
                      email.cc_emails =
                        parsed?.cc?.value?.map((cc: any) => cc.address) || [];
                      email.bcc_emails =
                        parsed?.bcc?.value?.map((bcc: any) => bcc.address) ||
                        [];
                      email.sender_name =
                        parsed?.from?.text?.split("<")[0]?.trim() || "";
                      email.from_user_name = email.sender_name; // Copy sender_name to from_user_name
                      email.from_user_email =
                        fromEmail?.substring(0, fromEmail?.length - 1) || "";
                      email.sender_email = email.from_user_email; // Copy from_user_email to sender_email
                      email.to_user_email = parsed?.to?.value?.map(
                        (to: any) => to.address
                      ) || [session?.user?.email];
                      email.email_message = email.body; // Duplicate body to email_message field

                      // Use parsed body if available, otherwise use previously extracted content
                      if (!email.body)
                        email.body =
                          formattedText?.[0] ||
                          parsed.html ||
                          parsed.text ||
                          "No Content";

                      // Set creation date from email date or current time
                      email.created_date =
                        parsed.date?.toISOString() || new Date().toISOString();

                      // Add the processed email to the emails array
                      emails.push(email);
                      processedCount++;

                      // If all emails have been processed, end the connection and resolve the promise
                      if (processedCount === results.length) {
                        imap.end();
                        resolve(emails);
                      }
                    });
                  });
                }
              });
            });

            // Handle errors during fetching
            fetcher.once("error", (err) => {
              reject(err);
            });

            // Handle completion of fetching
            fetcher.once("end", () => {
              // Fetch completed - no action needed here as we resolve in the message handler
            });
          });
        });
      });

      // Handle IMAP connection errors
      imap.once("error", (err: any) => {
        reject(err);
      });

      // Handle IMAP connection end
      imap.once("end", () => {
        // IMAP connection ended - no action needed here
      });

      // Establish the IMAP connection
      imap.connect();
    });

    console.log("emails---->", emails);
    // Sort emails by date, most recent first
    emails.sort(
      (a, b) =>
        new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
    );
    console.log("emails---->", emails);
    // Save emails to database if any were fetched
    if (emails.length > 0) {
      try {
        const existingEmailsFetch = await fetch(
          `${EMAIL_LIST_API}?business_number=eq.${session?.user?.business_number}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
          }
        );
        const existingEmails = await existingEmailsFetch.json();
        const existingEmailUids = existingEmails.map(
          (email: any) => email.email_uid
        );
        const newEmails = emails.filter(
          (email) => !existingEmailUids.includes(email.email_uid)
        );
        if (newEmails.length === 0) {
          console.log("No new emails to save");
          return NextResponse.json({
            success: true,
            count: 0,
            emails: [],
          });
        }

        // Prepare emails for database by converting arrays to JSON strings
        const preparedEmails = newEmails.map((email) => ({
          ...email,
          // Convert arrays to JSON strings for PostgreSQL, but handle empty arrays properly
          to_user_email:
            email.to_user_email.length > 0 ? email.to_user_email : [],
          cc_emails:
            email.cc_emails && email.cc_emails.length > 0
              ? email.cc_emails
              : [],
          bcc_emails:
            email.bcc_emails && email.bcc_emails.length > 0
              ? email.bcc_emails
              : [],
          // Add additional required fields
          created_date: email.created_date,
          business_name: session?.user?.business_name || "",
          email_message: email.body, // Duplicate body to email_message field
        }));

        console.log("Saving emails to database:", preparedEmails.length);

        // Use the API endpoint to save emails to the database
        const response = await fetch(EMAIL_LIST_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
          body: JSON.stringify(preparedEmails),
        });

        // Log response for debugging
        const responseData = await response.text();
        console.log("Database save response status:", response.status);
        console.log("Database save response:", responseData);

        // Log error if saving to database fails
        if (!response.ok) {
          console.error("Failed to save emails to database:", responseData);
        }
      } catch (error) {
        console.error("Error saving emails:", error);
      }
    }

    // Return success response with the fetched emails
    return NextResponse.json({
      success: true,
      count: emails.length,
      emails: emails,
    });
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error("Caught error:", error);
    return NextResponse.json(
      { error: "Error fetching emails" },
      { status: 500 }
    );
  }
}
