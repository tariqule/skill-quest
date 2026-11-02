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
import queues from "./modules/m6-messaging/queues";
import api from "./modules/m7-apis/api";
import discovery from "./modules/m7-apis/discovery";
import realtime from "./modules/m7-apis/realtime";
import fault from "./modules/m8-reliability/fault";
import observe from "./modules/m8-reliability/observe";
import ddb from "./modules/m9-distributed/ddb";
import storage from "./modules/m9-distributed/storage";
import time from "./modules/m9-distributed/time";
import method from "./modules/m10-method/method";
import designAutocomplete1 from "./modules/m11-designs/autocomplete1";
import designAutocomplete2 from "./modules/m11-designs/autocomplete2";
import designCrawler1 from "./modules/m11-designs/crawler1";
import designCrawler2 from "./modules/m11-designs/crawler2";
import designDrive1 from "./modules/m11-designs/drive1";
import designDrive2 from "./modules/m11-designs/drive2";
import designVideo1 from "./modules/m11-designs/video1";
import designVideo2 from "./modules/m11-designs/video2";
import designChash from "./modules/m11-designs/chash";
import designChat1 from "./modules/m11-designs/chat1";
import designChat2 from "./modules/m11-designs/chat2";
import designFeed1 from "./modules/m11-designs/feed1";
import designFeed2 from "./modules/m11-designs/feed2";
import designId from "./modules/m11-designs/id";
import designKv1 from "./modules/m11-designs/kv1";
import designKv2 from "./modules/m11-designs/kv2";
import designNotify1 from "./modules/m11-designs/notify1";
import designNotify2 from "./modules/m11-designs/notify2";
import designRatelimit from "./modules/m11-designs/ratelimit";
import designScale from "./modules/m11-designs/scale";
import designShortener from "./modules/m11-designs/shortener";

/** Every written topic. Adding a topic = one file under `modules/` plus one line here. */
export const TOPIC_CONTENT: readonly TopicContent[] = [
  intro, network, scaling, latency, availability, estimation,
  lb, proxy, cdn, ratelimit,
  cache, cacheEvict,
  sqlNosql, indexes, transactions, replication, sharding, denorm, chash,
  cap, consistency,
  queues,
  api, realtime, discovery,
  fault, observe,
  ddb, time, storage,
  method,
  designScale, designRatelimit, designChash, designKv1, designKv2, designId, designShortener,
  designCrawler1, designCrawler2, designNotify1, designNotify2, designFeed1, designFeed2, designChat1, designChat2,
  designAutocomplete1, designAutocomplete2, designVideo1, designVideo2, designDrive1, designDrive2,
];
