"use client";

import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploaderProProps {
  value?: string | null; // image URL
  onChange: (url: string | null) => void;
}

interface MediaItem {
  id: number;
  url: string;
}

export function ImageUploaderPro({ value, onChange }: ImageUploaderProProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "library">("upload");
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploading, setUploading] = useState(false);

  const limit = 9; // items per page

  // Fetch media library from server
  const fetchLibrary = async (page: number = 1) => {
    try {
      const res = await fetch(`/api/media?page=${page}&limit=${limit}`);
      const data = await res.json();
      setMediaLibrary(data.items);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLibrary(page);
  }, [page]);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  // Handle file selection & upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json(); // { id, url }
      if (data.url) {
        toast.success("Image uploaded successfully");
        setPreview(data.url);
        onChange(data.url);
        fetchLibrary(page); // refresh library
        setOpen(false);
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div>
      {preview ? (
        <div className="relative w-36 h-36">
          <img
            src={preview}
            alt="Preview"
            className="w-36 h-36 object-cover rounded-xl border shadow-sm"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow"
          >
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className="w-36 h-36 border border-dashed rounded-xl flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 transition">
              <div className="text-sm">Upload Image</div>
              <div className="text-xs text-gray-400">PNG / JPG</div>
            </div>
          </DialogTrigger>

          <DialogContent className="max-w-lg w-full">
            <h2 className="text-lg font-semibold mb-4">Select Image</h2>

            <Tabs
              value={activeTab}
                onValueChange={setActiveTab as (value: string) => void}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="library">Media Library</TabsTrigger>
              </TabsList>

              {/* Upload Tab */}
              <TabsContent value="upload">
                <div
                  onClick={() => inputRef.current?.click()}
                  className="w-full h-40 border border-dashed rounded-xl flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 transition"
                >
                  {uploading ? "Uploading..." : "Click to select file"}
                  <div className="text-xs text-gray-400">PNG / JPG</div>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              </TabsContent>

              {/* Media Library Tab */}
              <TabsContent value="library">
                <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                  {mediaLibrary.map((item) => (
                    <img
                      key={item.id}
                      src={item.url}
                      alt="media"
                      className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                      onClick={() => {
                        setPreview(item.url);
                        onChange(item.url);
                        setOpen(false);
                      }}
                    />
                  ))}
                </div>
                {/* Pagination */}
                <div className="flex justify-between mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <div>
                    Page {page} / {totalPages}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 flex justify-end">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
