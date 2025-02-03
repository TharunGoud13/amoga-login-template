"use client";

import React, { useCallback, useState } from "react";

import RcTiptapEditor, {
  BaseKit,
  Blockquote,
  Bold,
  BulletList,
  Clear,
  Code,
  CodeBlock,
  Color,
  ColumnActionButton,
  Emoji,
  ExportPdf,
  ExportWord,
  FontFamily,
  FontSize,
  FormatPainter,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  Iframe,
  Image,
  ImportWord,
  Indent,
  Italic,
  Katex,
  LineHeight,
  Link,
  MoreMark,
  OrderedList,
  SearchAndReplace,
  SlashCommand,
  Strike,
  Table,
  TaskList,
  TextAlign,
  Underline,
  Video,
  locale,
  TableOfContents,
  Excalidraw,
  TextDirection,
  Mention,
  Attachment,
  ImageGif,
  Mermaid,
  Twitter,
} from "reactjs-tiptap-editor";

import "katex/dist/katex.min.css";

import "reactjs-tiptap-editor/style.css";
import { toast } from "../ui/use-toast";

function convertBase64ToBlob(base64: string) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

const extensions = [
  BaseKit.configure({
    multiColumn: true,
    placeholder: {
      showOnlyCurrent: true,
    },
    characterCount: {
      limit: 50_000,
    },
  }),
  Image.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files));
        }, 500);
      });
    },
  }),

  //   Attachment.configure({
  //     upload: (file: any) => {
  //       // fake upload return base 64
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);

  //       return new Promise((resolve) => {
  //         setTimeout(() => {
  //           const blob = convertBase64ToBlob(reader.result as string);
  //           resolve(URL.createObjectURL(blob));
  //         }, 300);
  //       });
  //     },
  //   }),
];

interface ImageTemplateProps {
  content: string;
  onContentChange: (content: string) => void;
}

export default function ImageTemplate({
  content,
  onContentChange,
}: ImageTemplateProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const refEditor = React.useRef<any>(null);

  const [theme, setTheme] = useState("light");
  const [disable, setDisable] = useState(false);

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
