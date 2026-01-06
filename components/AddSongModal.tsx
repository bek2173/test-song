"use client"
 
import type React from "react"   
    
import { useState } from "react" 
import { useDispatch } from "react-redux"  
import { createSongRequest } from "@/lib/features/songs/songsSlice"
import { Button } from "@/components/ui/button"    
import { Input } from "@/components/ui/input"  
import { Label } from "@/components/ui/label"     
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface AddSongModalProps {
  isOpen: boolean  
  onClose: () => void  
}  
  
export default function AddSongModal({ isOpen, onClose }: AddSongModalProps) {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.artist && formData.album && formData.genre) {
      dispatch(createSongRequest(formData))
      setFormData({ title: "", artist: "", album: "", genre: "" })
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
          <DialogTitle>Add a New Song</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter song title"  
              required
            />
          </div> 
          <div className="space-y-2">     
            <Label htmlFor="artist">Artist *</Label>    
            <Input      
              id="artist" 
              name="artist"    
              value={formData.artist}     
              onChange={handleChange}
              placeholder="Enter artist name"     
              required
            /> 
          </div>     

          <div className="space-y-2">
            <Label htmlFor="album">Album *</Label>  
            <Input
              id="album"
              name="album"
              value={formData.album}
              onChange={handleChange}
              placeholder="Enter album name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre *</Label>
            <Input
              id="genre"
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
            <Button type="submit">Add Song</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
