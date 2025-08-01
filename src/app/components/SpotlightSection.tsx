"use client";
import { Spotlight } from "../../types/spotlight";
import { SpotlightCategory } from "../../types/spotlight";
import SpotlightListWithLoadMore from "./SpotlightListWithLoadMore";

export default function SpotlightSection({ allSpotlights, categories }: { allSpotlights: Spotlight[], categories: SpotlightCategory[] }) {
  return <SpotlightListWithLoadMore allSpotlights={allSpotlights} categories={categories} />;
}
