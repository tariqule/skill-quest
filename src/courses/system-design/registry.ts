import type { TopicContent } from "./schema";
import availability from "./modules/m1-fundamentals/availability";
import estimation from "./modules/m1-fundamentals/estimation";
import intro from "./modules/m1-fundamentals/intro";
import latency from "./modules/m1-fundamentals/latency";
import network from "./modules/m1-fundamentals/network";
import scaling from "./modules/m1-fundamentals/scaling";

/** Every written topic. Adding a topic = one file under `modules/` plus one line here. */
export const TOPIC_CONTENT: readonly TopicContent[] = [intro, network, scaling, latency, availability, estimation];
