// src/hooks/useRecommendations.js
import { useEffect, useState } from "react";
import tmdbApi, { category } from "../api/tmdbApi";

export function useRecommendations(currentUser, limit = 12) {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const watchlist = currentUser?.watchlist || [];
  const watchedMovies = watchlist.filter((m) => m.status === "watched");

  useEffect(() => {
    let isMounted = true;

    const loadRecommendations = async () => {
      if (!currentUser || watchedMovies.length === 0) {
        if (isMounted) setRecommendedMovies([]);
        return;
      }

      setLoadingRecs(true);
      try {
        const res = await fetch(`${process.env.PUBLIC_URL || ""}/recommendations.json`);
        const jsonRecs = res.ok ? await res.json() : [];

        const svdScoreMap = new Map();
        jsonRecs.forEach((item) => {
          svdScoreMap.set(String(item.movieId), Number(item.predictedRating) || 0);
        });

        const excludedIds = new Set(watchlist.map((m) => String(m.id)));
        const genreCounts = {};
        const candidates = new Map();

        await Promise.all(
          watchedMovies.map(async (w) => {
            try {
              const detail = await tmdbApi.detail(category.movie, w.id, { params: {} });
              (detail.genres || []).forEach((g) => {
                const gid = String(g.id);
                genreCounts[gid] = (genreCounts[gid] || 0) + 1;
              });
            } catch {}

            try {
              const simRes = await tmdbApi.similar(category.movie, w.id, { params: { page: 1 } });
              (simRes?.results || []).slice(0, 12).forEach((m) => {
                const mid = String(m.id);
                if (!excludedIds.has(mid) && !candidates.has(mid)) {
                  candidates.set(mid, m);
                }
              });
            } catch {}
          })
        );

        const topSvdIds = jsonRecs
          .map((item) => String(item.movieId))
          .filter((id) => !excludedIds.has(id) && !candidates.has(id))
          .slice(0, 20);

        const svdDetails = await Promise.all(
          topSvdIds.map(async (id) => {
            try {
              return await tmdbApi.detail(category.movie, id, { params: {} });
            } catch {
              return null;
            }
          })
        );

        svdDetails.filter(Boolean).forEach((m) => {
          candidates.set(String(m.id), m);
        });

        const ranked = Array.from(candidates.values())
          .map((m) => {
            const movieGenreIds = m.genre_ids
              ? m.genre_ids.map(String)
              : (m.genres || []).map((g) => String(g.id));

            const genreScore = movieGenreIds.reduce(
              (sum, gid) => sum + (genreCounts[gid] || 0) * 1.2,
              0
            );
            const svdScore = svdScoreMap.get(String(m.id)) || 3.5;

            return {
              ...m,
              id: m.id,
              title: m.title || m.original_title || "Unknown Title",
              poster: m.poster_path || m.backdrop_path || "",
              poster_path: m.poster_path || m.backdrop_path || "",
              finalScore: svdScore + genreScore,
            };
          })
          .sort((a, b) => b.finalScore - a.finalScore)
          .slice(0, limit);

        if (isMounted) {
          setRecommendedMovies(ranked);
        }
      } catch (err) {
        console.error("Error loading recommendations:", err);
        if (isMounted) setRecommendedMovies([]);
      } finally {
        if (isMounted) setLoadingRecs(false);
      }
    };

    loadRecommendations();
    return () => {
      isMounted = false;
    };
  }, [currentUser, JSON.stringify(watchlist), limit]);

  return { recommendedMovies, loadingRecs };
}