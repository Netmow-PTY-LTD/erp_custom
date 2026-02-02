"use client";

import React, { useState, useEffect, useRef } from "react";
import { Trash2, Copy, User, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface MediaItem {
    id: number;
    url: string;
    filename: string;
    uploader?: {
        name: string;
        email: string;
    };
    created_at: string;
}

export default function GalleryPage() {
    const token = Cookies.get("token");
    const API_URL = import.meta.env.VITE_API_URL;
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // ---------------- HELPER ----------------
    const getFullUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
        return `${API_URL}${url}`;
    };

    // ---------------- FETCH ----------------
    const fetchLibrary = async (pageNum = 1) => {
        try {
            const res = await fetch(
                `${API_URL}/api/upload/images?page=${pageNum}&limit=24`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();

            setMediaLibrary(data?.data || []);
            const totalPage = parseInt(data?.pagination?.totalPage || "1", 10);
            setTotalPages(totalPage);
            const currentPage = parseInt(data?.pagination?.page || "1", 10);
            setPage(currentPage);
        } catch (err) {
            console.error("Library fetch error:", err);
        }
    };

    useEffect(() => {
        fetchLibrary(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    // ---------------- UPLOAD ----------------
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        let successCount = 0;

        try {
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch(`${API_URL}/api/upload/image`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });
                const data = await res.json();
                if (data?.data?.url) {
                    successCount++;
                } else {
                    toast.error(`Failed to upload ${file.name}`);
                }
            }

            if (successCount > 0) {
                toast.success(`${successCount} Image(s) uploaded successfully`);
                if (inputRef.current) inputRef.current.value = "";
                fetchLibrary(1);
                setPage(1);
            }
        } catch (err) {
            console.error(err);
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    // ---------------- DELETE ----------------
    const deleteImage = async (url: string) => {
        if (!confirm("Delete this image permanently?")) return;
        const filename = url.split("/").pop();
        if (!filename) return;

        try {
            const res = await fetch(`${API_URL}/api/upload/images/${filename}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                toast.success("Image deleted");
                setMediaLibrary((prev) => prev.filter((i) => getFullUrl(i.url) !== url));
            } else {
                toast.error("Failed to delete image");
            }
        } catch (err) {
            console.error(err);
            toast.error("Delete failed");
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success("URL copied to clipboard");
    };

    const filteredMedia = mediaLibrary.filter(item =>
        item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.uploader?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <TooltipProvider>
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            My Gallery
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your digital assets and uploads
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search images..."
                                className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={() => inputRef.current?.click()}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Upload New Image"}
                        </Button>
                        <input
                            type="file"
                            ref={inputRef}
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[60vh]">
                    {filteredMedia.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-lg font-medium">No images found.</p>
                            <p className="text-sm">Try a different search or upload something new.</p>
                            <Button
                                variant="link"
                                onClick={() => inputRef.current?.click()}
                                className="mt-4 text-blue-600"
                            >
                                Upload your first image
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                            {filteredMedia.map((item) => {
                                const fullUrl = getFullUrl(item.url);
                                return (
                                    <div
                                        key={item.id || item.url}
                                        className="group relative border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 aspect-square shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <img
                                            src={fullUrl}
                                            alt={item.filename}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />

                                        {/* Overlay Info */}
                                        <div className="absolute top-2 left-2 z-10">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="bg-black/50 backdrop-blur-md p-1.5 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <User size={12} />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent side="right">
                                                    <p className="text-xs font-medium">{item.uploader?.name || 'Unknown'}</p>
                                                    <p className="text-[10px] opacity-70">{new Date(item.created_at).toLocaleDateString()}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => copyToClipboard(fullUrl)}
                                                        className="p-2.5 bg-white text-gray-700 rounded-xl hover:bg-white hover:text-blue-600 transition-colors shadow-xl"
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>Copy URL</TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <a
                                                        href={fullUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2.5 bg-white text-gray-700 rounded-xl hover:bg-white hover:text-green-600 transition-colors shadow-xl"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                </TooltipTrigger>
                                                <TooltipContent>Open Original</TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => deleteImage(fullUrl)}
                                                        className="p-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-xl"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>Delete permanently</TooltipContent>
                                            </Tooltip>
                                        </div>

                                        {/* Filename label on hover */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <p className="text-[10px] text-white truncate font-medium">
                                                {item.filename}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-10">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Previous
                            </Button>
                            <div className="flex items-center px-6 py-1.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 text-sm font-semibold">
                                Page {page} of {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl"
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
}
