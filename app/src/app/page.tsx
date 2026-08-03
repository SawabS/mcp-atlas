import { Atlas } from "@/components/atlas/atlas";
import { availableModels } from "@/lib/models";

export default function Home() {
  /*
   * Which models have a key on this deployment, resolved on the server so no
   * secret reaches the browser. The static export cannot host /api/chat, so
   * this cannot be a route handler; it is read here and passed down instead.
   */
  const readyModels = availableModels()
    .filter((model) => model.ready)
    .map((model) => model.key);

  return <Atlas readyModels={readyModels} />;
}
