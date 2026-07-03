# Sentinel Projects Collector Framework

Collectors transform public construction source records into the project-first schema used by the application.

This v0.1 framework intentionally does not scrape live systems yet. Future collectors should extend `BaseCollector`, return raw source records, then normalize each record into projects with attached permits, companies, and documents.

Planned collector families:

- Accela permit portals
- Tyler Technologies permit portals
- OpenGov datasets
- Planning commission agendas
- PDF packets and staff reports

