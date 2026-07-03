"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Project } from "@/lib/types";

export function ProjectMap({ projects }: { projects: Project[] }) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!container.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: container.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-121.35, 38.85],
      zoom: 7.5,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    projects.forEach((project) => {
      const popup = new maplibregl.Popup({ offset: 16 }).setHTML(
        `<div style="font: 13px system-ui; min-width: 180px;"><strong>${project.name}</strong><br/>${project.status} · ${project.city}<br/><a href="/projects/${project.id}">Open project</a></div>`,
      );
      new maplibregl.Marker({ color: "#18181b" })
        .setLngLat([project.longitude, project.latitude])
        .setPopup(popup)
        .addTo(map);
    });
    mapRef.current = map;
    return () => map.remove();
  }, [projects]);

  return (
    <div className="h-[calc(100vh-12rem)] min-h-[520px] overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div ref={container} className="h-full w-full" />
      <div className="sr-only">
        {projects.map((project) => <Link key={project.id} href={`/projects/${project.id}`}>{project.name}</Link>)}
      </div>
    </div>
  );
}

