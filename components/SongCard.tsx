"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { deleteSongRequest } from "@/lib/features/songs/songsSlice"
import type { Song } from "@/lib/features/songs/songsSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Music } from "lucide-react"
import EditSongModal from "./EditSongModal"

interface SongCardProps {
  song: Song
}

export default function SongCard({ song }: SongCardProps) {
  const dispatch = useDispatch()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      dispatch(deleteSongRequest(song._id))
    }
  }

  return (
    <>
      <Card className="group transition-all hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                <Music className="h-4 w-4 text-primary" />
              </div>
              <Badge variant="secondary" className="text-xs">
                {song.genre}
              </Badge>
            </div>
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(true)} className="h-8 w-8 p-0">
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <h3 className="font-semibold text-foreground line-clamp-1">{song.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{song.artist}</p>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <span className="line-clamp-1">{song.album}</span>
            <span>{new Date(song.createdAt).toLocaleDateString()}</span>
          </div>
        </CardFooter>
      </Card>

      <EditSongModal song={song} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </>
  )
}
