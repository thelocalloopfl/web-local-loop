"use client";
import EventListWithLoadMore from "./EventListWithLoadMore";
import { EventItem } from "../../../types/event";
import type { Category } from "../../lib/fetchCategories";

export default function EventSection({ allEvents, categories }: { allEvents: EventItem[], categories: Category[] }) {
  return <EventListWithLoadMore allEvents={allEvents} categories={categories} />;
}
