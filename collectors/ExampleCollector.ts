import { BaseCollector } from "./BaseCollector";
import { normalizePlanningRecord } from "./normalize";
import type { RawSourceRecord } from "./types";

export class ExampleCollector extends BaseCollector {
  readonly sourceName = "Example Planning Feed";
  readonly sourceType = "Planning Portal";
  readonly baseUrl = "https://example.gov/planning";

  async collect(): Promise<RawSourceRecord[]> {
    return [
      {
        sourceId: "example-planning",
        sourceName: this.sourceName,
        sourceUrl: `${this.baseUrl}/projects/demo-industrial-yard`,
        capturedAt: new Date().toISOString(),
        payload: {
          external_id: "demo-industrial-yard",
          name: "Demo Industrial Yard",
          description: "Example record showing how future Accela, Tyler, OpenGov, agenda, and PDF collectors feed the same schema.",
          project_type: "Industrial",
          status: "Planning",
          city: "Lincoln",
          county: "Placer County",
          state: "CA",
          address: "Industrial Ave, Lincoln, CA",
          latitude: 38.8916,
          longitude: -121.293,
          estimated_value: "$12500000",
        },
      },
    ];
  }

  normalize(record: RawSourceRecord) {
    return normalizePlanningRecord(record);
  }
}

