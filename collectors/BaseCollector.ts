import type { CollectorRunResult, NormalizedProjectRecord, RawSourceRecord } from "./types";

export abstract class BaseCollector {
  abstract readonly sourceName: string;
  abstract readonly sourceType: string;
  abstract readonly baseUrl: string;

  abstract collect(): Promise<RawSourceRecord[]>;
  abstract normalize(record: RawSourceRecord): NormalizedProjectRecord | null;

  async run(): Promise<CollectorRunResult> {
    const rawRecords = await this.collect();
    const normalizedRecords = rawRecords
      .map((record) => this.normalize(record))
      .filter((record): record is NormalizedProjectRecord => Boolean(record));

    return {
      sourceName: this.sourceName,
      rawRecords,
      normalizedRecords,
    };
  }
}

