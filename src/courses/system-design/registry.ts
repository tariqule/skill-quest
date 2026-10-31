import type { TopicContent } from "./schema";
import availability from "./modules/m1-fundamentals/availability";
import estimation from "./modules/m1-fundamentals/estimation";
import intro from "./modules/m1-fundamentals/intro";
import latency from "./modules/m1-fundamentals/latency";
import network from "./modules/m1-fundamentals/network";
import scaling from "./modules/m1-fundamentals/scaling";
import cdn from "./modules/m2-traffic/cdn";
import lb from "./modules/m2-traffic/lb";
import proxy from "./modules/m2-traffic/proxy";
import ratelimit from "./modules/m2-traffic/ratelimit";
import cache from "./modules/m3-caching/cache";
import cacheEvict from "./modules/m3-caching/evict";
import chash from "./modules/m4-data/chash";
import denorm from "./modules/m4-data/denorm";
import indexes from "./modules/m4-data/indexes";
import replication from "./modules/m4-data/replication";
import sharding from "./modules/m4-data/sharding";
import sqlNosql from "./modules/m4-data/sql-nosql";
import transactions from "./modules/m4-data/transactions";
import cap from "./modules/m5-consistency/cap";
import consistency from "./modules/m5-consistency/consistency";

/** Every written topic. Adding a topic = one file under `modules/` plus one line here. */
export const TOPIC_CONTENT: readonly TopicContent[] = [
  intro, network, scaling, latency, availability, estimation,
  lb, proxy, cdn, ratelimit,
  cache, cacheEvict,
  sqlNosql, indexes, transactions, replication, sharding, denorm, chash,
  cap, consistency,
];
