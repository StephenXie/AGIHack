"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Moon, Sun, Save, Code } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as cheerio from "cheerio";
import SuggestedEditCard from "./edit_card";

const useHtmlEditor = (initialHtml: string) => {
  const [html, setHtml] = useState(initialHtml);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const cursorPositionRef = useRef<number>(0);

  const updateHtml = useCallback((newHtml: string) => {
    setHtml(newHtml);
  }, []);

  const toggleHtmlMode = useCallback(() => {
    setIsHtmlMode((prev) => !prev);
  }, []);

  const saveCursorPosition = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      cursorPositionRef.current = range.startOffset;
    }
  }, []);

  const restoreCursorPosition = useCallback(() => {
    if (editorRef.current) {
      const selection = window.getSelection();
      const range = document.createRange();
      let textNode: Node | null = null;

      // Find the first text node
      const findTextNode = (node: Node): Node | null => {
        if (node.nodeType === Node.TEXT_NODE) return node;
        for (const childNode of node.childNodes) {
          const found = findTextNode(childNode);
          if (found) return found;
        }
        return null;
      };

      textNode = findTextNode(editorRef.current);

      if (!textNode) {
        // If no text node is found, create one
        textNode = document.createTextNode("");
        editorRef.current.appendChild(textNode);
      }

      const offset = Math.min(
        cursorPositionRef.current,
        textNode.textContent?.length || 0
      );

      try {
        range.setStart(textNode, offset);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      } catch (error) {
        console.error("Error setting cursor position:", error);
        // If setting the cursor fails, move it to the end of the content
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      saveCursorPosition();
      if (isHtmlMode) {
        editorRef.current.textContent = html;
      } else {
        editorRef.current.innerHTML = html || "<p></p>"; // Ensure there's always content
      }
      restoreCursorPosition();
    }
  }, [html, isHtmlMode, saveCursorPosition, restoreCursorPosition]);

  return {
    html,
    updateHtml,
    isHtmlMode,
    toggleHtmlMode,
    editorRef,
    saveCursorPosition,
  };
};

export default function Component() {
  const {
    html,
    updateHtml,
    isHtmlMode,
    toggleHtmlMode,
    editorRef,
    saveCursorPosition,
  } = useHtmlEditor("<p>Start writing your HTML here...</p>");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [editTone, setEditTone] = useState<string>("Professional");
  const [suggestions, setSuggestions] = useState<Map<string, string[]>>(new Map<string, string[]>());

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    updateCounts();
  }, [html]);

  const handleEdit = async () => {
    setIsEditing(true);
    var response = await fetch("http://127.0.0.1:8000/api/get_edits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: html.toString(), tone: editTone }),
    });
    var data = await response.json();
    updateHtml(data.text);
    updateSuggestions(data.text);
    setIsEditing(false);
  };
  const cleanHTML = (htmlString: string) => {
    // Load the HTML string into Cheerio
    const $ = cheerio.load(htmlString);

    // Remove all elements except the span tags, but keep their content
    $("*:not(span)").each(function () {
      $(this).replaceWith($(this).text());
    });

    // Get the clean text
    return $.text();
  };
  const updateSuggestions = (text: string) => {
    const $ = cheerio.load(text);
    var res = new Map();
    for (var i = 1; i < 20; i++) {
      var x = $(`#${i}o`);
      var y = $(`#${i}n`);
      if (x.text().trim() !== "") {
        let key = `${i}` ?? "";
        res.set(key, [x.text().trim(), y.text().trim()]);
      } else {
        break;
      }
    }
    setSuggestions(res);
    console.log(res);
    console.log(suggestions);
  };
  const updateCounts = () => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    setCharCount(text.length);
  };

  const handleInput = () => {
    if (editorRef.current) {
      if (editorRef.current.textContent?.trim() === "") {
        setSuggestions(new Map<string, string[]>());
      }
      updateHtml(
        isHtmlMode
          ? editorRef.current.textContent || ""
          : cleanHTML(editorRef.current.innerHTML)
      );
      saveCursorPosition();
    }
  };

  const handleAccept = (id: string) => {
    const $ = cheerio.load(html);
    $(`#${id}o`).remove();
    $(`#${id}n`).replaceWith($(`#${id}n`).text());
    updateHtml($.html());
    var newSuggestions = suggestions
    newSuggestions.delete(`${id}`);
    setSuggestions(newSuggestions);
  };
  const handleDecline = (id: string) => {
    const $ = cheerio.load(html);
    $(`#${id}o`).replaceWith($(`#${id}o`).text());
    $(`#${id}n`).remove();
    updateHtml($.html());
    var newSuggestions = suggestions
    newSuggestions.delete(`${id}`);
    setSuggestions(newSuggestions);
  };
  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? "dark" : ""}`}>
      <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          HTML Essay Editor
        </h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Words: {wordCount} | Characters: {charCount}
          </div>
          <Select onValueChange={setEditTone} defaultValue={editTone}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Casual">Casual</SelectItem>
              <SelectItem value="Persuasive">Persuasive</SelectItem>
              <SelectItem value="Excited">Excited</SelectItem>
              <SelectItem value="None">None</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleEdit}
            disabled={isEditing}
            className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
          >
            {isEditing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Editing...
              </>
            ) : (
              "Edit Text"
            )}
          </Button>
          <Button
            onClick={toggleHtmlMode}
            className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
          >
            <Code className="mr-2 h-4 w-4" />
            {isHtmlMode ? "Preview" : "Edit HTML"}
          </Button>
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </div>
        </div>
      </header>
      <main className="flex-1 flex justify-center items-start p-4 bg-white dark:bg-gray-900 transition-colors duration-200 overflow-auto">
        <div className="flex flex-row">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="w-full max-w-xl p-4 text-lg font-serif text-gray-800 dark:text-gray-200 bg-transparent outline-none transition-all duration-200 ease-in-out"
          style={{
            minHeight: "calc(100vh - 160px)",
            whiteSpace: isHtmlMode ? "pre-wrap" : "normal",
            fontFamily: isHtmlMode ? "monospace" : "inherit",
          }}
        />
        <div className="max-w-3xl mx-auto">
          {[...suggestions.keys()].map((key) => (
            <div key={key}>
              <SuggestedEditCard before={ (suggestions.get(key) ?? [])[0] ?? ""} after={(suggestions.get(key) ?? [])[1] ?? ""} onAccept={() => handleAccept(key)} onDecline={() => handleDecline(key)}/>
            </div>
          ))}
        </div>
        </div>
      </main>
    </div>
  );
}
