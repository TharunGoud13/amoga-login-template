"use client";

import React, { useState } from "react";

import RcTiptapEditor, { BaseKit, Heading } from "reactjs-tiptap-editor";

import "katex/dist/katex.min.css";

import "reactjs-tiptap-editor/style.css";
import { toast } from "../ui/use-toast";

const extensions = [
  BaseKit.configure({
    multiColumn: true,
    placeholder: {
      showOnlyCurrent: true,
    },
  }),

  Heading.configure({ spacer: true }),
];

interface HeadingTemplateProps {
  content: string;
  onContentChange: (content: string) => void;
}

export default function HeadingTemplate({
  content,
  onContentChange,
}: HeadingTemplateProps) {
  const [theme, setTheme] = useState("light");

  return (
    <main className="">
      <div className="max-w-[1024px] mx-auto">
        <RcTiptapEditor
          //   ref={refEditor}
          output="html"
          content={content}
          onChangeContent={onContentChange}
          extensions={extensions}
          dark={theme === "dark"}
          //   disabled={disable}
        />
      </div>
    </main>
  );
}
