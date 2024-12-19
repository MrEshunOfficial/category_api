"use client";

import { useState, useEffect } from "react";
import { Region } from "@/types/regions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, AlertCircle } from "lucide-react";

export default function RegionsDirectory() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/regions");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.data) {
        setRegions(result.data);
      } else {
        throw new Error("No regions data available");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch regions";
      setError(errorMessage);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionClick = (region: Region) => {
    setSelectedRegion(region);
  };

  if (loading) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full flex flex-col h-full">
      <CardHeader className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 lg:p-6 rounded-t-xl">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Regional Directory
          </CardTitle>
          <div className="flex items-center space-x-4">
            {loading && (
              <span className="text-sm text-white/70">Loading...</span>
            )}
          </div>
        </div>
      </CardHeader>

      <div className="w-full h-full flex gap-2 p-2">
        <Card className="flex-1 h-full p-2">
          <CardHeader>
            <CardTitle>Regions</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {regions.map((region) => (
                  <button
                    key={region.region}
                    onClick={() => handleRegionClick(region)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all
                      ${
                        selectedRegion?.region === region.region
                          ? "bg-blue-100 text-blue-800 font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    {region.region}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex-1 h-full p-2">
          <CardHeader>
            <CardTitle>
              Districts in {selectedRegion?.region || "the Region"}
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <ScrollArea className="h-[400px] pr-4">
              {selectedRegion ? (
                <div className="grid grid-cols-1 gap-2">
                  {selectedRegion.cities.map((city) => (
                    <div
                      key={city}
                      className="px-4 py-3 rounded-lg bg-gray-50 text-gray-700"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  Choose a region to view its cities
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
