import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertTestResult } from "@shared/routes";

export type TestState = "idle" | "ping" | "download" | "upload" | "complete" | "error";

interface SpeedTestMetrics {
  ping: number; // ms
  download: number; // Mbps
  upload: number; // Mbps
  progress: number; // 0-100
}

export function useSpeedTest() {
  const [state, setState] = useState<TestState>("idle");
  const [metrics, setMetrics] = useState<SpeedTestMetrics>({
    ping: 0,
    download: 0,
    upload: 0,
    progress: 0,
  });
  const queryClient = useQueryClient();

  // Save Result Mutation
  const saveMutation = useMutation({
    mutationFn: async (data: InsertTestResult) => {
      const res = await fetch(api.speedTest.saveResult.path, {
        method: api.speedTest.saveResult.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save result");
      return api.speedTest.saveResult.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.speedTest.getHistory.path] });
    },
  });

  const runTest = useCallback(async () => {
    if (state !== "idle" && state !== "complete" && state !== "error") return;
    
    setState("ping");
    setMetrics({ ping: 0, download: 0, upload: 0, progress: 0 });

    try {
      // --- PHASE 1: PING ---
      // Measure RTT multiple times for accuracy
      let totalPing = 0;
      const pingCount = 5;
      
      for (let i = 0; i < pingCount; i++) {
        const start = performance.now();
        await fetch(api.speedTest.ping.path);
        const end = performance.now();
        totalPing += (end - start);
        setMetrics(prev => ({ ...prev, progress: (i + 1) / pingCount * 10 })); // 0-10% progress
      }
      
      const avgPing = Math.round(totalPing / pingCount);
      setMetrics(prev => ({ ...prev, ping: avgPing }));

      // --- PHASE 2: DOWNLOAD ---
      setState("download");
      
      // We'll do a few fetches to simulate a stream and get an average
      // 1MB, 3MB, 5MB chunks
      const dlSizes = [1000000, 3000000, 5000000];
      let totalDlSpeed = 0;

      for (let i = 0; i < dlSizes.length; i++) {
        const size = dlSizes[i];
        const start = performance.now();
        await fetch(`${api.speedTest.download.path}?sizeBytes=${size}`);
        const end = performance.now();
        const durationSec = (end - start) / 1000;
        const bits = size * 8;
        const mbps = (bits / durationSec) / 1000000;
        
        totalDlSpeed += mbps;
        
        // Update interim UI
        setMetrics(prev => ({ 
          ...prev, 
          download: parseFloat(mbps.toFixed(2)),
          progress: 10 + ((i + 1) / dlSizes.length * 40) // 10-50% progress
        }));
      }
      
      const avgDl = parseFloat((totalDlSpeed / dlSizes.length).toFixed(2));
      setMetrics(prev => ({ ...prev, download: avgDl }));

      // --- PHASE 3: UPLOAD ---
      setState("upload");
      
      const ulSizes = [1000000, 2000000, 3000000]; // Smaller chunks for upload to be safe
      let totalUlSpeed = 0;

      for (let i = 0; i < ulSizes.length; i++) {
        const size = ulSizes[i];
        const randomData = new Uint8Array(size); // Random binary
        const blob = new Blob([randomData]);
        
        const start = performance.now();
        await fetch(api.speedTest.upload.path, {
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
          progress: 50 + ((i + 1) / ulSizes.length * 50) // 50-100% progress
        }));
      }

      const avgUl = parseFloat((totalUlSpeed / ulSizes.length).toFixed(2));
      setMetrics(prev => ({ ...prev, upload: avgUl, progress: 100 }));

      // --- COMPLETE ---
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
    queryKey: [api.speedTest.getHistory.path],
    queryFn: async () => {
      const res = await fetch(api.speedTest.getHistory.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.speedTest.getHistory.responses[200].parse(await res.json());
    },
  });
}
