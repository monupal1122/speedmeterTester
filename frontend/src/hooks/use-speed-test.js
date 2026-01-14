import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useSpeedTest() {
  const [state, setState] = useState("idle");
  const [metrics, setMetrics] = useState({
    ping: 0,
    download: 0,
    upload: 0,
    progress: 0,
  });
  const queryClient = useQueryClient();

  // Save Result Mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save result");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/results"] });
    },
  });

  const runTest = useCallback(async () => {
    if (state !== "idle" && state !== "complete" && state !== "error") return;

    setState("ping");
    setMetrics({ ping: 0, download: 0, upload: 0, progress: 0 });

    try {
      // --- PHASE 1: PING ---
      let totalPing = 0;
      const pingCount = 10;

      for (let i = 0; i < pingCount; i++) {
        const start = performance.now();
        await fetch("/api/ping");
        const end = performance.now();
        totalPing += (end - start);
        setMetrics(prev => ({ ...prev, progress: (i + 1) / pingCount * 10 }));
      }

      const avgPing = Math.round(totalPing / pingCount);
      setMetrics(prev => ({ ...prev, ping: avgPing }));

      // --- PHASE 2: DOWNLOAD ---
      setState("download");

      const dlSizes = [10*1024*1024, 20*1024*1024, 30*1024*1024]; // 10MB, 20MB, 30MB
      let totalDlSpeed = 0;

      for (let i = 0; i < dlSizes.length; i++) {
        const size = dlSizes[i];
        const start = performance.now();
        await fetch(`/api/download-test?sizeBytes=${size}`);
        const end = performance.now();
        const durationSec = (end - start) / 1000;
        const bits = size * 8;
        const mbps = (bits / durationSec) / 1000000;

        totalDlSpeed += mbps;

        setMetrics(prev => ({
          ...prev,
          download: parseFloat(mbps.toFixed(2)),
          progress: 10 + ((i + 1) / dlSizes.length * 40)
        }));
      }

      const avgDl = parseFloat((totalDlSpeed / dlSizes.length).toFixed(2));
      setMetrics(prev => ({ ...prev, download: avgDl }));

      // --- PHASE 3: UPLOAD ---
      setState("upload");

      const ulSizes = [5*1024*1024, 10*1024*1024, 15*1024*1024]; // 5MB, 10MB, 15MB
      let totalUlSpeed = 0;

      for (let i = 0; i < ulSizes.length; i++) {
        const size = ulSizes[i];
        const randomData = new Uint8Array(size);
        const blob = new Blob([randomData]);

        const start = performance.now();
        await fetch("/api/upload-test", {
          method: 'POST',
          body: blob
        });
        const end = performance.now();

        const durationSec = (end - start) / 1000;
        const bits = size * 8;
        const mbps = (bits / durationSec) / 1000000;

        totalUlSpeed += mbps;

        setMetrics(prev => ({
          ...prev,
          upload: parseFloat(mbps.toFixed(2)),
          progress: 50 + ((i + 1) / ulSizes.length * 50)
        }));
      }

      const avgUl = parseFloat((totalUlSpeed / ulSizes.length).toFixed(2));
      setMetrics(prev => ({ ...prev, upload: avgUl, progress: 100 }));

      setState("complete");
      saveMutation.mutate({
        ping: avgPing,
        downloadSpeed: avgDl,
        uploadSpeed: avgUl,
      });

    } catch (err) {
      console.error(err);
      setState("error");
    }
  }, [saveMutation, state]);

  const reset = useCallback(() => {
    setState("idle");
    setMetrics({ ping: 0, download: 0, upload: 0, progress: 0 });
  }, []);

  return {
    state,
    metrics,
    runTest,
    reset,
    isSaving: saveMutation.isPending
  };
}

export function useHistory() {
  return useQuery({
    queryKey: ["/api/results"],
    queryFn: async () => {
      const res = await fetch("/api/results");
      if (!res.ok) throw new Error("Failed to fetch history");
      return await res.json();
    },
  });
}
