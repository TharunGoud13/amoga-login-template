'use client'

import React, { useState } from 'react'
import Image from 'next/image'
// import { Link } from 'next-view-transitions'
import Link from 'next/link'

import { FormFieldType } from '@/types'
import { defaultFieldConfig } from '@/constants'
// import { useMediaQuery } from '@/hooks/use-media-query'
import { useMediaQuery } from '../../../hooks/use-media-query'
import { Separator } from '@/components/ui/separator'
// import If from '@/components/ui/if'
import If from '../ui/if'
// import SpecialComponentsNotice from '@/components/playground/special-component-notice'
import SpecialComponentsNotice from './special-component-notice'
// import { FieldSelector } from '@/screens/field-selector'
import { FieldSelector } from './FieldSelector'
// import { FormFieldList } from '@/screens/form-field-list'
import { FormFieldList } from './FormFieldList'
// import { FormPreview } from '@/screens/form-preview'
import { FormPreview } from './FormPreview'
// import { EditFieldDialog } from '@/screens/edit-field-dialog'
import { EditFieldDialog } from './EditFieldDialog'

// import EmptyListImage from '@/assets/oc-thinking.png'
import EmptyListImage from "@/assets/oc-thinking.png"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import List from '../form_maker/List'
import Entries from '../form_maker/Entries'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

export default function FormBuilder() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [formFields, setFormFields] = useState<FormFieldOrGroup[]>([])
  const [selectedField, setSelectedField] = useState<FormFieldType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formInput, setFormInput] = useState("");


  const addFormField = (variant: string, index: number) => {
    const newFieldName = `name_${Math.random().toString().slice(-10)}`

    const { label, description, placeholder } = defaultFieldConfig[variant] || {
      label: '',
      description: '',
      placeholder: '',
    }

    const newField: FormFieldType = {
      checked: true,
      description: description || '',
      disabled: false,
      label: label || newFieldName,
      name: newFieldName,
      onChange: () => { },
      onSelect: () => { },
      placeholder: placeholder || 'Placeholder',
      required: true,
      rowIndex: index,
      setValue: () => { },
      type: '',
      value: '',
      variant,
    }
    setFormFields([...formFields, newField])
  }

  const handleSave = () => {
    console.log("formInput----", formInput);
  };

  const findFieldPath = (
    fields: FormFieldOrGroup[],
    name: string,
  ): number[] | null => {
    const search = (
      currentFields: FormFieldOrGroup[],
      currentPath: number[],
    ): number[] | null => {
      for (let i = 0; i < currentFields.length; i++) {
        const field = currentFields[i]
        if (Array.isArray(field)) {
          const result = search(field, [...currentPath, i])
          if (result) return result
        } else if (field.name === name) {
          return [...currentPath, i]
        }
      }
      return null
    }
    return search(fields, [])
  }

  const updateFormField = (path: number[], updates: Partial<FormFieldType>) => {
    const updatedFields = JSON.parse(JSON.stringify(formFields)) // Deep clone
    let current: any = updatedFields
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }
    current[path[path.length - 1]] = {
      ...current[path[path.length - 1]],
      ...updates,
    }
    setFormFields(updatedFields)
  }

  const openEditDialog = (field: FormFieldType) => {
    setSelectedField(field)
    setIsDialogOpen(true)
  }

  const handleSaveField = (updatedField: FormFieldType) => {
    if (selectedField) {
      const path = findFieldPath(formFields, selectedField.name)
      if (path) {
        updateFormField(path, updatedField)
      }
    }
    setIsDialogOpen(false)
  }

  const FieldSelectorWithSeparator = ({
    addFormField,
  }: {
    addFormField: (variant: string, index?: number) => void
  }) => (
    <div className="flex flex-col md:flex-row gap-3">
      <FieldSelector addFormField={addFormField} />
      <Separator orientation={isDesktop ? 'vertical' : 'horizontal'} />
    </div>
  )

  return (
    <section className="p-2.5 space-y-8">
      <Tabs defaultValue="form" className=" pt-5 pr-5 pl-5">
        <TabsList className="grid md:w-[400px] grid-cols-3">
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="entries">Entries</TabsTrigger>
        </TabsList>
          <TabsContent value="form">

          <div className="flex pt-4 gap-2.5 md:w-[400px] items-center">
        <Input
          type="text"
          value={formInput}
          onChange={(e) => setFormInput(e.target.value)}
          placeholder="Enter form name"
        />
        <Button onClick={handleSave}>Save</Button>
      </div>
      <div className="flex md:w-[400px] text-primary text-sm justify-between pt-3">
        <span>Version No: 1.0</span>
        <span>Date: 19 Nov 2024</span>
      </div>
          <If
        condition={formFields.length > 0}
        render={() => (
          <div className="grid grid-cols-1 pt-6 md:grid-cols-2 items-start gap-8 md:px-5 h-full">
            <div className="w-full h-full col-span-1 md:space-x-3 md:max-h-[75vh] flex flex-col md:flex-row ">
              <FieldSelectorWithSeparator
                addFormField={(variant: string, index: number = 0) =>
                  addFormField(variant, index)
                }
              />
              <div className="overflow-y-auto  flex-1 ">
                <FormFieldList
                  formFields={formFields}
                  setFormFields={setFormFields}
                  updateFormField={updateFormField}
                  openEditDialog={openEditDialog}
                />
              </div>
            </div>
            <div className="col-span-1 w-full h-full space-y-3">
              <SpecialComponentsNotice formFields={formFields} />
              <FormPreview formFields={formFields} />
            </div>
          </div>
        )}
        otherwise={() => (
          <div className="flex flex-col md:flex-row items-center gap-3 md:px-5">
            <FieldSelectorWithSeparator
              addFormField={(variant: string, index: number = 0) =>
                addFormField(variant, index)
              }
            />
            <Image
              src={EmptyListImage}
              width={585}
              height={502}
              alt="Empty Image"
              className="object-contain mx-auto p-5 md:p-20"
            />
          </div>
        )}
      />
      <EditFieldDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        field={selectedField}
        onSave={handleSaveField}
      />
          </TabsContent>
          <TabsContent value="list">
            <List/>
          </TabsContent>
          <TabsContent value="entries">
            <Entries/>
          </TabsContent>
      </Tabs>
      
    </section>
  )
}
