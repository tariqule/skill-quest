import { expect, it } from "vitest";
import { validateCourse } from "@/engine/validate";
import course from ".";
import { cheapestDr, cheapestS3, DR_SCENARIOS, probeVpc, S3_SCENARIOS } from "./labs";

it("aws-saa-c03 content is valid", () => expect(validateCourse(course)).toEqual([]));

it("lab goals are reachable and teach the intended answers", () => {
  const steps = [0, 1, 5, 15, 30, 60, 240, 720, 1440];
  expect(DR_SCENARIOS.map((s) => cheapestDr(steps[s.rpo], steps[s.rto]).id)).toEqual(["backup", "pilot", "warm", "active"]);
  expect(S3_SCENARIOS.map((s) => cheapestS3(s).id)).toEqual(["standard", "standard", "sia", "ozia", "gir", "gfr", "da", "it"]);
  const fixed = probeVpc({ igw: true, nat: "public", pubRoute: true, privRoute: "nat", publicIp: false, s3Endpoint: false });
  expect(fixed.egress.ok && fixed.inbound.ok).toBe(true);
  const isolated = probeVpc({ igw: true, nat: "none", pubRoute: true, privRoute: "none", publicIp: false, s3Endpoint: true });
  expect(isolated.viaEndpoint && !isolated.egress.ok && isolated.inbound.ok).toBe(true);
});
