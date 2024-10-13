import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered,
  Link,
  Image,
  RotateCcw,
  RotateCw,
  Share2
} from 'lucide-react'

export default function Document() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top menu bar */}
      <div className="bg-white border-b px-4 py-2 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <span className="font-semibold"><Input placeholder='Title' defualtValue='Untitled document'/></span>
        </div>
        <nav className="hidden md:flex space-x-4">
          {['File', 'Edit', 'View', 'Insert', 'Format', 'Tools'].map((item) => (
            <Button key={item} variant="ghost" className="text-sm">{item}</Button>
          ))}
        </nav>
        <div className="flex-grow"></div>
        <Button variant="ghost" size="icon"><RotateCcw className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon"><RotateCw className="h-4 w-4" /></Button>
        <Button variant="ghost"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b px-4 py-2 flex items-center space-x-2">
        <select className="border rounded px-2 py-1 text-sm">
          <option>Normal text</option>
        </select>
        <select className="border rounded px-2 py-1 text-sm">
          <option>Arial</option>
        </select>
        <Input type="number" className="w-16 text-sm" defaultValue="18" />
        <Button variant="ghost" size="icon"><Bold className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon"><Italic className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon"><Underline className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon"><AlignLeft className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon"><AlignCenter className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon"><AlignRight className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon"><List className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon"><ListOrdered className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon"><Link className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon"><Image className="h-4 w-4" /></Button>
      </div>

      {/* Main content area */}
      <div className="flex-grow flex">
        {/* Left sidebar */}
        <div className="w-48 bg-white border-r p-4">
          <h2 className="font-semibold mb-2">Document tabs</h2>
          <div className="bg-blue-100 p-2 rounded">
            <span className="font-medium">Tab 1</span>
          </div>
        </div>

        {/* Document area */}
        <div className="flex-grow p-4">
          <Textarea 
            className="w-full h-full resize-none border-0 focus:ring-0 p-12 text-lg" 
            placeholder="Type your document here..."
          />
        </div>

        {/* Right sidebar */}
        <div className="w-64 bg-white border-l p-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              <span className="font-medium">User Name</span>
            </div>
            <Input placeholder="Add a comment..." />
            <div className="flex justify-end mt-2">
              <Button variant="ghost" className="text-sm mr-2">Cancel</Button>
              <Button size="sm">Comment</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}