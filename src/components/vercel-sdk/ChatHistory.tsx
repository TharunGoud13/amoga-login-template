import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function ChatHistory() {
  const router = useRouter();
  const { data: chats, error } = useSWR("/api/history", fetcher, {
    onError: (err) => {
      if (err.status === 401) {
        // Redirect to login or handle unauthorized state
        router.push("/login");
      }
    },
  });

  // ... rest of the component code
}
