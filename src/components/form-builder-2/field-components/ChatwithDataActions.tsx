"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, GripVertical, X, Check, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Define the shape of the data you are working with
interface FormEntry {
  id: number;
  buttonText: string;
  isPrompt: boolean;
  promptText: string;
  isApi: boolean;
  apiEndpoint: string;
  apiField: string;
  component_name: string;
  storyApiEnabled: boolean;
  storyApi: string;
  actionApiEnabled: boolean;
  actionApi: string;
  automationName: string;
  html: string;
  json: string;
}

const COMPONENT_NAMES = [
  "Data Card Line Chart",
  "Data Card Bar Chart",
  "Data Card Bar Chart Horizontal",
  "Data Card Donut Chart",
];

function SortableItem({
  entry,
  onEdit,
  onDelete,
  onSave,
}: {
  entry: FormEntry;
  onEdit: () => void;
  onDelete: () => void;
  onSave: (updatedEntry: FormEntry) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState(entry);

  const handleEdit = () => {
    setIsEditing(true);
    onEdit();
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave(editedEntry);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedEntry(entry);
  };

  return (
    <Draggable draggableId={String(entry.id)} index={entry.id}>
      {(provided) => (
        <div
          className="flex items-start space-x-2 p-4 bg-secondary border-b last:border-b-0"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="cursor-grab pt-1">
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
          {isEditing ? (
            <div className="flex-grow space-y-4">
              <div>
                <Label htmlFor={`button-text-${entry.id}`}>Button text</Label>
                <Input
                  id={`button-text-${entry.id}`}
                  value={editedEntry.buttonText}
                  onChange={(e) =>
                    setEditedEntry({
                      ...editedEntry,
                      buttonText: e.target.value,
                    })
                  }
                  className="mt-1"
                  placeholder="Enter button text"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`is-prompt-${entry.id}`}
                  checked={editedEntry.isPrompt}
                  onCheckedChange={(checked) =>
                    setEditedEntry({
                      ...editedEntry,
                      isPrompt: checked as boolean,
                    })
                  }
                />
                <Label htmlFor={`is-prompt-${entry.id}`}>Is Prompt</Label>
              </div>
              <div>
                <Label htmlFor={`prompt-text-${entry.id}`}>Prompt</Label>
                <Input
                  id={`prompt-text-${entry.id}`}
                  value={editedEntry.promptText}
                  onChange={(e) =>
                    setEditedEntry({
                      ...editedEntry,
                      promptText: e.target.value,
                    })
                  }
                  className="mt-1"
                  placeholder="Enter prompt text"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`is-api-${entry.id}`}
                  checked={editedEntry.isApi}
                  onCheckedChange={(checked) =>
                    setEditedEntry({
                      ...editedEntry,
                      isApi: checked as boolean,
                    })
                  }
                />
                <Label htmlFor={`is-api-${entry.id}`}>Is API</Label>
              </div>
              <div>
                <Label htmlFor={`api-endpoint-${entry.id}`}>API endpoint</Label>
                <Input
                  id={`api-endpoint-${entry.id}`}
                  value={editedEntry.apiEndpoint}
                  onChange={(e) =>
                    setEditedEntry({
                      ...editedEntry,
                      apiEndpoint: e.target.value,
                    })
                  }
                  className="mt-1"
                  placeholder="Enter API endpoint"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="default" size="sm" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-grow">
              <div className="font-medium">
                {entry.buttonText || "Untitled Button"}
              </div>
              {entry.buttonText && (
                <>
                  <div className="text-sm text-gray-500">
                    Is Prompt: {entry.isPrompt ? "Yes" : "No"}
                  </div>
                  <div className="text-sm text-gray-500">
                    Prompt: {entry.promptText || "Not set"}
                  </div>
                  <div className="text-sm text-gray-500">
                    Is API: {entry.isApi ? "Yes" : "No"}
                  </div>
                  <div className="text-sm text-gray-500">
                    API: {entry.apiEndpoint || "Not set"}
                  </div>
                  <div className="text-sm text-gray-500">
                    Component Name: {entry.component_name || "Not set"}
                  </div>
                </>
              )}
              <div className="mt-2 flex justify-end space-x-2">
                <Button variant="ghost" size="sm" onClick={handleEdit}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

function NewEntryForm({
  onSave,
  onCancel,
  editedField,
  setEditedField,
}: {
  onSave: (entry: FormEntry) => void;
  onCancel: () => void;
  editedField: any;
  setEditedField: (field: any) => void;
}) {
  const [newEntry, setNewEntry] = useState<FormEntry>({
    id: Date.now(),
    buttonText: "",
    isPrompt: false,
    promptText: "",
    isApi: false,
    apiEndpoint: "",
    storyApiEnabled: false,
    storyApi: "",
    actionApiEnabled: false,
    actionApi: "",
    automationName: "",
    html: "",
    json: "",
    apiField: "",
    component_name: "",
  });

  const handleSave = () => {
    console.log("newEntry----", newEntry);
    if (
      !newEntry.buttonText ||
      !newEntry.component_name ||
      (!newEntry.promptText && !newEntry.apiEndpoint)
    )
      return;
    onSave(newEntry);
    setNewEntry({
      id: Date.now(),
      buttonText: "",
      isPrompt: false,
      promptText: "",
      isApi: false,
      apiEndpoint: "",
      apiField: "",
      component_name: "",
      storyApi: "",
      storyApiEnabled: false,
      actionApiEnabled: false,
      actionApi: "",
      automationName: "",
      html: "",
      json: "",
    });
  };

  return (
    <div className="flex items-center justify-center p-2.5  border-b last:border-b-0">
      <div className="w-5" /> {/* Placeholder for the drag handle */}
      <div className="flex-grow space-y-4">
        <div>
          <Label htmlFor="new-button-text">Button text</Label>
          <Input
            id="new-button-text"
            value={newEntry.buttonText}
            onChange={(e) => {
              setNewEntry({ ...newEntry, buttonText: e.target.value });
              setEditedField({
                ...editedField,
              });
            }}
            className="mt-1"
            placeholder="Enter button text"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="new-is-prompt"
            checked={newEntry.isPrompt}
            onCheckedChange={(checked) =>
              setNewEntry({ ...newEntry, isPrompt: checked as boolean })
            }
          />
          <Label htmlFor="new-is-prompt">Is Prompt</Label>
        </div>
        <div>
          <Label htmlFor="new-prompt-text">Prompt</Label>
          <Input
            id="new-prompt-text"
            disabled={!newEntry.isPrompt}
            value={newEntry.promptText}
            onChange={(e) =>
              setNewEntry({ ...newEntry, promptText: e.target.value })
            }
            className="mt-1"
            placeholder="Enter prompt text"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="new-is-api"
            checked={newEntry.isApi}
            onCheckedChange={(checked) =>
              setNewEntry({ ...newEntry, isApi: checked as boolean })
            }
          />
          <Label htmlFor="new-is-api">Is API</Label>
        </div>
        <div>
          <Label htmlFor="new-api-endpoint">API endpoint</Label>
          <Input
            id="new-api-endpoint"
            disabled={!newEntry.isApi}
            value={newEntry.apiEndpoint}
            onChange={(e) =>
              setNewEntry({ ...newEntry, apiEndpoint: e.target.value })
            }
            className="mt-1"
            placeholder="Enter API endpoint"
          />
          <Label htmlFor="new-api-field">API Field</Label>
          <Input
            id="new-api-field"
            disabled={!newEntry.isApi}
            value={newEntry.apiField}
            onChange={(e) =>
              setNewEntry({ ...newEntry, apiField: e.target.value })
            }
            className="mt-1"
            placeholder="Enter API Field"
          />
        </div>
        <div>
          <Label htmlFor="component-name">Component Name</Label>
          <Select
            onValueChange={(value) => {
              setNewEntry({ ...newEntry, component_name: value });
            }}
          >
            <SelectTrigger id="component-name">
              <SelectValue placeholder="Select Component Name" />
            </SelectTrigger>
            <SelectContent>
              {COMPONENT_NAMES?.map((item: string, index: number) => (
                <SelectItem key={index} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="story-api"
            checked={newEntry.storyApiEnabled}
            onCheckedChange={(checked) =>
              setNewEntry({ ...newEntry, storyApiEnabled: checked as boolean })
            }
          />
          <Label htmlFor="story-api">Use Story API</Label>
        </div>
        <div>
          <Label htmlFor="story-endpoint">Story API </Label>
          <Input
            id="story-endpoint"
            disabled={!newEntry.storyApiEnabled}
            value={newEntry.storyApi}
            onChange={(e) =>
              setNewEntry({ ...newEntry, storyApi: e.target.value })
            }
            className="mt-1"
            placeholder="Enter Story API endpoint"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="action-api"
            checked={newEntry.actionApiEnabled}
            onCheckedChange={(checked) =>
              setNewEntry({ ...newEntry, actionApiEnabled: checked as boolean })
            }
          />
          <Label htmlFor="action-api">Use Action API</Label>
        </div>
        <div>
          <Label htmlFor="action-endpoint">Action API </Label>
          <Input
            id="action-endpoint"
            disabled={!newEntry.actionApiEnabled}
            value={newEntry.actionApi}
            onChange={(e) =>
              setNewEntry({ ...newEntry, actionApi: e.target.value })
            }
            className="mt-1"
            placeholder="Enter Action API endpoint"
          />
        </div>
        <div>
          <Label htmlFor="automation-name">Automation Name</Label>
          <Input
            id="automation-name"
            value={newEntry.automationName}
            onChange={(e) =>
              setNewEntry({ ...newEntry, automationName: e.target.value })
            }
            className="mt-1"
            placeholder="Enter Automation Name"
          />
        </div>
        <div>
          <Label htmlFor="html">HTML</Label>
          <Textarea
            id="html"
            value={newEntry.html}
            onChange={(e) => setNewEntry({ ...newEntry, html: e.target.value })}
            className="mt-1"
            placeholder="Enter HTML"
          />
        </div>
        <div>
          <Label htmlFor="json">JSON</Label>
          <Textarea
            id="json"
            value={newEntry.json}
            onChange={(e) => setNewEntry({ ...newEntry, json: e.target.value })}
            className="mt-1"
            placeholder="Enter JSON"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ChatwithDataActions({
  editedField,
  setEditedField,
}: any) {
  const [entries, setEntries] = useState<FormEntry[]>([]);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);

  const handleSave = (newEntry: FormEntry) => {
    // Update the 'buttons' array with the new button data
    setEditedField({
      ...editedField,
      chat_with_data: {
        ...editedField.chat_with_data,
        buttons: [
          ...editedField.chat_with_data.buttons,
          {
            button_text: newEntry.buttonText,
            prompt: newEntry.promptText,
            api_response: newEntry.isApi ? newEntry.apiEndpoint : "",
            enable_prompt: newEntry.isPrompt,
            enable_api: newEntry.isApi,
            component_name: newEntry?.component_name,
          },
        ],
      },
    });

    // Optionally update entries state if you want to keep them in sync
    setEntries([...entries, newEntry]);
    setShowNewEntryForm(false);
  };

  const handleDelete = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleSaveEdit = (updatedEntry: FormEntry) => {
    setEntries(
      entries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );

    // Update the 'buttons' array with the edited entry data
    setEditedField({
      ...editedField,
      chat_with_data: {
        ...editedField.chat_with_data,
        buttons: editedField.chat_with_data.buttons.map((button: any) =>
          button.button_text === updatedEntry.buttonText
            ? {
                ...button,
                button_text: updatedEntry.buttonText,
                prompt: updatedEntry.promptText,
                api_response: updatedEntry.isApi
                  ? updatedEntry.apiEndpoint
                  : "",
                enable_prompt: updatedEntry.isPrompt,
                enable_api: updatedEntry.isApi,
                component_name: updatedEntry?.component_name,
              }
            : button
        ),
      },
    });
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // If the item is dropped outside a valid destination, do nothing
    if (!destination) return;

    // Reorder the entries
    const reorderedEntries = Array.from(entries);
    const [movedEntry] = reorderedEntries.splice(source.index, 1);
    reorderedEntries.splice(destination.index, 0, movedEntry);

    setEntries(reorderedEntries);
  };

  return (
    <div className="w-full max-w-2xl space-y-8 p-2.5">
      <div className="rounded-xl border shadow-sm overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2"
              >
                {entries
                  .filter((entry) => entry?.buttonText) // Only show buttons with non-empty buttonText
                  .map((entry, index) => (
                    <SortableItem
                      key={entry.id}
                      entry={entry}
                      onEdit={() => {}}
                      onDelete={() => handleDelete(entry.id)}
                      onSave={handleSaveEdit}
                    />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {showNewEntryForm ? (
          <NewEntryForm
            onSave={handleSave}
            onCancel={() => setShowNewEntryForm(false)}
            editedField={editedField}
            setEditedField={setEditedField}
          />
        ) : (
          <Button
            variant="ghost"
            className="w-full py-2 text-gray-600 hover:text-gray-900"
            onClick={() => setShowNewEntryForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add New
          </Button>
        )}
      </div>
    </div>
  );
}
