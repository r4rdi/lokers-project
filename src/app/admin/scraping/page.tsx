"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ScrapingLog } from "@/types";

export default function ScrapingDashboard() {
  const supabase = createClient();
  const [logs, setLogs] = useState<ScrapingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [site, setSite] = useState("linkedin");
  const [search, setSearch] = useState("software engineer");
  const [location, setLocation] = useState("Indonesia");
  const [limit, setLimit] = useState(10);

  const fetchLogs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("scraping_logs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError("Failed to load scraping logs.");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchLogs();

    // Setup realtime subscription for updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scraping_logs',
        },
        () => {
          fetchLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLogs]);

  const handleTriggerScraping = async (e: React.FormEvent) => {
    e.preventDefault();
    setTriggering(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ site, search, location, limit }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to trigger scraping");
      }

      setSuccessMsg(data.message);

      // Delay fetching logs slightly to allow the script to insert the initial log
      setTimeout(fetchLogs, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard: Scraping Engine</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Control Panel */}
        <div className="col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Manual Trigger</h2>

          <form onSubmit={handleTriggerScraping} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Platform</label>
              <select
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
              >
                <option value="linkedin">LinkedIn</option>
                <option value="indeed">Indeed</option>
                <option value="glassdoor">Glassdoor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Search Term</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Results Limit</label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
                min="1"
                max="50"
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={triggering}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {triggering ? "Starting..." : "Run Scraper"}
            </button>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            {successMsg && <div className="text-green-500 text-sm mt-2">{successMsg}</div>}
          </form>
        </div>

        {/* Logs Table */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Scraping Logs</h2>
            <button onClick={fetchLogs} className="text-sm text-blue-600 hover:underline">
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10 text-zinc-500">Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-10 text-zinc-500">No scraping logs found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-md">Source</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Jobs Found</th>
                    <th className="px-4 py-3">Started</th>
                    <th className="px-4 py-3 rounded-tr-md">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const isSuccess = log.status === 'success';
                    const isFailed = log.status === 'failed';
                    const isPartial = log.status === 'partial';

                    // Calculate duration
                    let duration = '-';
                    if (log.started_at && log.finished_at) {
                      const start = new Date(log.started_at).getTime();
                      const end = new Date(log.finished_at).getTime();
                      const seconds = Math.round((end - start) / 1000);
                      duration = `${seconds}s`;
                    } else if (isPartial && log.started_at) {
                      duration = 'Running...';
                    }

                    return (
                      <tr key={log.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                        <td className="px-4 py-3 font-medium capitalize">{log.source}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${isSuccess ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              isFailed ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">{log.jobs_found}</td>
                        <td className="px-4 py-3 text-zinc-500">
                          {new Date(log.started_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-zinc-500">{duration}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
