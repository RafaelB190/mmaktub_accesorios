import "server-only";

import { cache } from "react";

import { demoEvents } from "./demo";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import type { StoreEvent } from "./types";

type EventRow = {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  location: string;
  address: string | null;
  maps_url: string | null;
  image: string | null;
  published: boolean;
  created_at: string;
};

function mapEvent(row: EventRow): StoreEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    startsAt: row.starts_at,
    location: row.location,
    address: row.address,
    mapsUrl: row.maps_url,
    image: row.image,
    published: row.published,
    createdAt: row.created_at,
  };
}

export const getAllEvents = cache(async (): Promise<StoreEvent[]> => {
  if (!isSupabaseConfigured) return demoEvents;

  const { data, error } = await getSupabase()
    .from("events")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) throw new Error(`No pudimos leer los eventos: ${error.message}`);
  return (data as EventRow[]).map(mapEvent);
});

export function splitEvents(events: StoreEvent[]) {
  const now = Date.now();
  const published = events.filter((event) => event.published);

  return {
    upcoming: published
      .filter((event) => new Date(event.startsAt).getTime() >= now)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
    past: published
      .filter((event) => new Date(event.startsAt).getTime() < now)
      .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()),
  };
}

export async function getPublicEvents() {
  return splitEvents(await getAllEvents());
}

export async function getEventById(id: string) {
  const events = await getAllEvents();
  return events.find((event) => event.id === id) ?? null;
}

export async function getNextEvent() {
  const { upcoming } = await getPublicEvents();
  return upcoming[0] ?? null;
}
