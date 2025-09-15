"use client";
import EventListWithLoadMore from "./EventListWithLoadMore";
import { EventItem } from "../../../types/event";
import type { Category } from "../../lib/fetchCategories";

export default function EventSection({ allEvents, categories ,  all }: { allEvents: EventItem[], categories: Category[] , all: boolean }) {
  return <EventListWithLoadMore allEvents={allEvents} categories={categories} all={all} />;
}
