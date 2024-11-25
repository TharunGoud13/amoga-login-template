"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import DataTableRowActions from "./data-table-row-actions"

export const columns: ColumnDef<any>[] = [
  { accessorKey: "form_id", header: "Form ID" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={
            status === "active" ? "default" :
            status === "completed" ? "outline" :
            status === "cancelled" ? "destructive" :
            "secondary"
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {accessorKey: "created_user_id", header: "Created By ID"},
  { accessorKey: "created_user_name", header: "Created By" },
  { 
    accessorKey: "created_date", 
    header: "Created Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_date"))
      return date.toLocaleDateString()
    },
  },
  { accessorKey: "form_name", header: "Form Name" },
  { accessorKey: "share_url", header: "Share URL" },
  { accessorKey: "version_no", header: "Version" },
  { 
    accessorKey: "form_json", 
    header: "Form Fields",
    cell: ({ row }) => {
      const formJson = row.getValue("form_json") as any[]
      return (
        <div>
          {formJson.map((field, index) => (
            <div key={index}>
              {field.label}: {field.variant}
            </div>
          ))}
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const formId = row.getValue("form_id") as string;
      return (
        <DataTableRowActions formId={formId}/>
      )
    },
  },
]

