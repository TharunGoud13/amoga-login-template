import React, { useState, useCallback, useMemo } from 'react';
import { Reorder, AnimatePresence } from 'framer-motion';
import { FormFieldType } from '@/types';
import { FieldItem } from './FieldItem';
import { LuRows } from 'react-icons/lu';
import { Badge } from '@/components/ui/badge';

// Constants
const REORDER_DELAY = 100; // Reduced from 1000ms to 100ms for better responsiveness
const GRID_COLUMNS = 12;

export type FormFieldOrGroup = FormFieldType | FormFieldType[];

type FormFieldListProps = {
  formFields: FormFieldOrGroup[];
  setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>;
  updateFormField: (path: number[], updates: Partial<FormFieldType>) => void;
  openEditDialog: (field: FormFieldType) => void;
};

/**
 * FormFieldList Component
 * @param {FormFieldOrGroup[]} formFields - Array of form fields or groups
 * @param {Function} setFormFields - State setter for form fields
 * @param {Function} updateFormField - Callback to update a specific field
 * @param {Function} openEditDialog - Callback to open edit dialog
 */
export const FormFieldList: React.FC<FormFieldListProps> = ({
  formFields,
  setFormFields,
  updateFormField,
  openEditDialog,
}) => {
  const [rowTabs, setRowTabs] = useState<{ [key: number]: FormFieldType[] }>({});
  const [isReordering, setIsReordering] = useState(false);

  const handleHorizontalReorder = useCallback(
    (index: number, newOrder: FormFieldType[]) => {
      if (index < 0 || !Array.isArray(newOrder)) return;
      
      setIsReordering(true);
      setRowTabs((prev) => ({ ...prev, [index]: newOrder }));
      
      setTimeout(() => {
        setFormFields((prevFields) => {
          const updatedFields = [...prevFields];
          updatedFields[index] = newOrder;
          return updatedFields;
        });
        setIsReordering(false);
      }, REORDER_DELAY);
    },
    [setFormFields]
  );

  const memoizedFieldItems = useMemo(() => 
    formFields.map((item, index) => (
      <Reorder.Item
        key={Array.isArray(item) ? `group-${index}` : `field-${item.id}`}
        value={item}
        className="flex items-center gap-1"
        whileDrag={{ backgroundColor: '#e5e7eb', borderRadius: '12px' }}
      >
        <LuRows className="cursor-grab w-4 h-4" aria-label="Drag to reorder" />
        {Array.isArray(item) ? (
          <HorizontalReorderGroup
            index={index}
            items={item}
            rowTabs={rowTabs}
            handleHorizontalReorder={handleHorizontalReorder}
            updateFormField={updateFormField}
            openEditDialog={openEditDialog}
          />
        ) : (
          <FieldItem
            field={item}
            index={index}
            formFields={formFields}
            setFormFields={setFormFields}
            updateFormField={updateFormField}
            openEditDialog={openEditDialog}
          />
        )}
      </Reorder.Item>
    )),
    [formFields, rowTabs, handleHorizontalReorder, updateFormField, openEditDialog, setFormFields]
  );

  return (
    <div className="mt-3 lg:mt-0" role="list" aria-label="Form fields list">
      <Reorder.Group
        axis="y"
        onReorder={setFormFields}
        values={formFields}
        className="flex flex-col gap-1"
      >
        {memoizedFieldItems}
      </Reorder.Group>
      {isReordering && <Badge>Reordering...</Badge>}
    </div>
  );
};

type HorizontalReorderGroupProps = {
  index: number;
  items: FormFieldType[];
  rowTabs: { [key: number]: FormFieldType[] };
  handleHorizontalReorder: (index: number, newOrder: FormFieldType[]) => void;
  updateFormField: (path: number[], updates: Partial<FormFieldType>) => void;
  openEditDialog: (field: FormFieldType) => void;
};

const HorizontalReorderGroup: React.FC<HorizontalReorderGroupProps> = ({
  index,
  items,
  rowTabs,
  handleHorizontalReorder,
  updateFormField,
  openEditDialog,
}) => (
  <Reorder.Group
    as="ul"
    axis="x"
    onReorder={(newOrder) => handleHorizontalReorder(index, newOrder)}
    values={rowTabs[index] || items}
    className={`w-full grid grid-cols-${GRID_COLUMNS} gap-1`}
  >
    <AnimatePresence initial={false}>
      {(rowTabs[index] || items).map((field, fieldIndex) => (
        <FieldItem
          key={`subfield-${field.id}`}
          index={index}
          subIndex={fieldIndex}
          field={field}
          formFields={[]} // This prop is not used in this context
          setFormFields={() => {}} // This prop is not used in this context
          updateFormField={updateFormField}
          openEditDialog={openEditDialog}
        />
      ))}
    </AnimatePresence>
  </Reorder.Group>
);