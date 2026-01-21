"use client"

import type React from "react"  
    
import { useState, useEffect } from "react"   
import { useDispatch } from "react-redux"
import { updateSongRequest } from "@/lib/features/songs/songsSlice"
import type { Song } from "@/lib/features/songs/songsSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"  
import { Label } from "@/components/ui/label"  
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
  
interface EditSongModalProps {    
  song: Song
  isOpen: boolean   
  onClose: () => void      
}
   
export default function EditSongModal({ song, isOpen, onClose }: EditSongModalProps) {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    title: song.title, 
    artist: song.artist,   
    album: song.album,
    genre: song.genre,  
  }) 

  useEffect(() => {    
    setFormData({
      title: song.title,
      artist: song.artist,   
      album: song.album,
      genre: song.genre,    
    })    
  }, [song])  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.artist && formData.album && formData.genre) {
      dispatch(updateSongRequest({ ...song, ...formData }))  
      onClose()   
    }  
  }       
    
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {   
    setFormData({ ...formData, [e.target.name]: e.target.value })   
  }  
  
  return (  
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit  Song</DialogTitle>   
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">  
          <div className="space-y-2">       
            <Label htmlFor="edit-title">Title *</Label>
            <Input      
              id="edit-title"  
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter song title"    
              required 
            />
          </div> 

          <div className="space-y-2"> 
            <Label htmlFor="edit-artist">Artist *</Label>
            <Input
              id="edit-artist"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              placeholder="Enter artist name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-album">Album *</Label>
            <Input
              id="edit-album"
              name="album"
              value={formData.album}
              onChange={handleChange}
              placeholder="Enter album name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-genre">Genre *</Label>
            <Input
              id="edit-genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="Enter genre"
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update your Songs</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
